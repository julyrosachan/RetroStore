using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RetroStoreApi.Data;
using RetroStoreApi.Models;

namespace RetroStoreApi.Controllers;

[Authorize(Roles = "admin")]
[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("products")]
    public async Task<IActionResult> GetProducts()
    {
        return Ok(await _context.Products.ToListAsync());
    }

    [HttpPost("products")]
    public async Task<IActionResult> AddProduct([FromBody] Product product)
    {
        if (product.Images == null || !product.Images.Any())
        {
            product.Images = new List<string> { product.ImageUrl };
        }

        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        return Ok(product);
    }

    [HttpPut("products/{id}")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] Product updatedProduct)
    {
        var existingProduct = await _context.Products.FindAsync(id);

        if (existingProduct == null)
            return NotFound("product not found");

        existingProduct.Name = updatedProduct.Name;
        existingProduct.Price = updatedProduct.Price;
        existingProduct.ImageUrl = updatedProduct.ImageUrl;
        existingProduct.Images = updatedProduct.Images?.Any() == true
            ? updatedProduct.Images
            : new List<string> { updatedProduct.ImageUrl };
        existingProduct.Category = updatedProduct.Category;
        existingProduct.SubCategory = updatedProduct.SubCategory;
        existingProduct.Brand = updatedProduct.Brand;
        existingProduct.Condition = updatedProduct.Condition;
        existingProduct.Description = updatedProduct.Description;

        await _context.SaveChangesAsync();
        return Ok(existingProduct);
    }

    [HttpDelete("products/{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);

        if (product == null)
            return NotFound("product not found");

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return Ok(new { message = "product deleted" });
    }

    [HttpGet("orders")]
    public async Task<IActionResult> GetOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.Items)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return Ok(orders);
    }

    [HttpPut("orders/{id}/status")]
    public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] OrderStatusRequest request)
    {
        var order = await _context.Orders.FindAsync(id);

        if (order == null)
            return NotFound("order not found");

        order.Status = request.Status;
        await _context.SaveChangesAsync();

        return Ok(order);
    }
}

public class OrderStatusRequest
{
    public string Status { get; set; } = "pending";
}