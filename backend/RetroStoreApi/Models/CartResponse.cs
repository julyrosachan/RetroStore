namespace RetroStoreApi.Models;

public class CartResponse
{
    public List<CartProductItem> Items { get; set; } = new();
    public decimal Subtotal { get; set; }
    public decimal Taxes { get; set; }
    public decimal Shipping { get; set; }
    public decimal Total { get; set; }
}