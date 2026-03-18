namespace RetroStoreApi.Models;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public decimal Price { get; set; }
    public string ImageUrl { get; set; } = "";
    public List<string> Images { get; set; } = new();
    public string Category { get; set; } = "";
    public string SubCategory { get; set; } = "";
    public string Brand { get; set; } = "";
    public string Condition { get; set; } = "";
    public string Description { get; set; } = "";
}