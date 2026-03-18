namespace RetroStoreApi.Models;

public class CheckoutRequest
{
    public string EmailAddress { get; set; } = "";
    public string PhoneNumber { get; set; } = "";

    public string CardholderName { get; set; } = "";
    public string CardNumber { get; set; } = "";
    public string Expiry { get; set; } = "";
    public string Cvv { get; set; } = "";

    public string FullName { get; set; } = "";
    public string Address { get; set; } = "";
    public string City { get; set; } = "";
    public string PostalCode { get; set; } = "";

    public string BillingAddress { get; set; } = "";
}