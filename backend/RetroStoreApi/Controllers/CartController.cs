using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RetroStoreApi.Data;
using RetroStoreApi.Models;

namespace RetroStoreApi.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly AppDbContext _context;

    public CartController(AppDbContext context)
    {
        _context = context;
    }

   private int GetUserId()
{
    var userIdClaim =
        User.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value
        ?? User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value
        ?? User.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;

    if (string.IsNullOrWhiteSpace(userIdClaim))
    {
        throw new Exception("user id claim not found in token");
    }

    if (!int.TryParse(userIdClaim, out var userId))
    {
        throw new Exception("user id claim is invalid");
    }

    return userId;
}

    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        var userId = GetUserId();
        return Ok(await BuildCartResponse(userId));
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartRequest request)
    {
        var userId = GetUserId();

        var product = await _context.Products.FindAsync(request.ProductId);
        if (product == null)
            return NotFound("product not found");

        var existingItem = await _context.CartItems
            .FirstOrDefaultAsync(i => i.UserId == userId && i.ProductId == request.ProductId);

        if (existingItem == null)
        {
            _context.CartItems.Add(new CartItem
            {
                UserId = userId,
                ProductId = request.ProductId,
                Quantity = Math.Max(1, request.Quantity)
            });
        }
        else
        {
            existingItem.Quantity += Math.Max(1, request.Quantity);
        }

        await _context.SaveChangesAsync();
        return Ok(await BuildCartResponse(userId));
    }

    [HttpPut("update")]
    public async Task<IActionResult> UpdateCartItem([FromBody] AddToCartRequest request)
    {
        var userId = GetUserId();

        var existingItem = await _context.CartItems
            .FirstOrDefaultAsync(i => i.UserId == userId && i.ProductId == request.ProductId);

        if (existingItem == null)
            return NotFound("cart item not found");

        if (request.Quantity <= 0)
            _context.CartItems.Remove(existingItem);
        else
            existingItem.Quantity = request.Quantity;

        await _context.SaveChangesAsync();
        return Ok(await BuildCartResponse(userId));
    }

    [HttpDelete("remove/{productId}")]
    public async Task<IActionResult> RemoveFromCart(int productId)
    {
        var userId = GetUserId();

        var existingItem = await _context.CartItems
            .FirstOrDefaultAsync(i => i.UserId == userId && i.ProductId == productId);

        if (existingItem != null)
        {
            _context.CartItems.Remove(existingItem);
            await _context.SaveChangesAsync();
        }

        return Ok(await BuildCartResponse(userId));
    }

    [HttpDelete("clear")]
    public async Task<IActionResult> ClearCart()
    {
        var userId = GetUserId();
        var cartItems = await _context.CartItems.Where(i => i.UserId == userId).ToListAsync();

        _context.CartItems.RemoveRange(cartItems);
        await _context.SaveChangesAsync();

        return Ok(await BuildCartResponse(userId));
    }

    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout([FromBody] CheckoutRequest request)
    {
        var userId = GetUserId();
        var cart = await BuildCartResponse(userId);

        if (!cart.Items.Any())
            return BadRequest("cart is empty");

        if (string.IsNullOrWhiteSpace(request.EmailAddress) ||
            string.IsNullOrWhiteSpace(request.FullName) ||
            string.IsNullOrWhiteSpace(request.Address))
        {
            return BadRequest("missing required checkout fields");
        }

        var newOrder = new Order
        {
            UserId = userId,
            CustomerName = request.FullName,
            EmailAddress = request.EmailAddress,
            PhoneNumber = request.PhoneNumber,
            Address = request.Address,
            City = request.City,
            PostalCode = request.PostalCode,
            BillingAddress = request.BillingAddress,
            Subtotal = cart.Subtotal,
            Taxes = cart.Taxes,
            Shipping = cart.Shipping,
            Total = cart.Total,
            Status = "pending",
            CreatedAt = DateTime.UtcNow,
            Items = cart.Items.Select(i => new OrderItem
            {
                ProductId = i.ProductId,
                Name = i.Name,
                Price = i.Price,
                Quantity = i.Quantity,
                LineTotal = i.LineTotal
            }).ToList()
        };

        _context.Orders.Add(newOrder);

        var cartItems = await _context.CartItems.Where(i => i.UserId == userId).ToListAsync();
        _context.CartItems.RemoveRange(cartItems);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "order placed successfully",
            orderId = newOrder.Id,
            orderTotal = newOrder.Total
        });
    }

    private async Task<CartResponse> BuildCartResponse(int userId)
    {
        var userCartItems = await _context.CartItems
            .Where(i => i.UserId == userId)
            .ToListAsync();

        var cartItems = new List<CartProductItem>();

        foreach (var item in userCartItems)
        {
            var product = await _context.Products.FindAsync(item.ProductId);
            if (product == null) continue;

            cartItems.Add(new CartProductItem
            {
                ProductId = product.Id,
                Name = product.Name,
                Price = product.Price,
                ImageUrl = product.ImageUrl,
                Brand = product.Brand,
                SubCategory = product.SubCategory,
                Quantity = item.Quantity,
                LineTotal = product.Price * item.Quantity
            });
        }

        var subtotal = cartItems.Sum(i => i.LineTotal);
        var taxes = subtotal * 0.08m;
        var shipping = cartItems.Any() ? 14m : 0m;
        var total = subtotal + taxes + shipping;

        return new CartResponse
        {
            Items = cartItems,
            Subtotal = subtotal,
            Taxes = taxes,
            Shipping = shipping,
            Total = total
        };
    }
}