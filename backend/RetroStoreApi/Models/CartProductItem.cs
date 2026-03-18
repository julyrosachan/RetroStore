namespace RetroStoreApi.Models;

public class CartProductItem
{
    public int ProductId { get; set; }
    public string Name { get; set; } = "";
    public decimal Price { get; set; }
    public string ImageUrl { get; set; } = "";
    public string Brand { get; set; } = "";
    public string SubCategory { get; set; } = "";
    public int Quantity { get; set; }
    public decimal LineTotal { get; set; }
}