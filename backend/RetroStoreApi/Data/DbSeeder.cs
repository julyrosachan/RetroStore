using RetroStoreApi.Models;

namespace RetroStoreApi.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext context)
    {
        if (!context.Users.Any())
        {
            context.Users.Add(new User
            {
                Name = "admin",
                Email = "admin@retrostore.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                Role = "admin"
            });
        }

        if (!context.Products.Any())
        {
            context.Products.AddRange(
                new Product
                {
                    Name = "canon sure shot",
                    Price = 120,
                    ImageUrl = "./images/photo-video/canon01.jpg",
                    Images = new List<string> { "./images/photo-video/canon01.jpg" },
                    Category = "photo-video",
                    SubCategory = "analog camera",
                    Brand = "canon",
                    Condition = "used",
                    Description = "a compact canon point-and-shoot film camera made for easy everyday shooting. this model is great for street photos, travel moments, and soft flash photography with a nostalgic film look. just load 35mm film, frame your shot, and press the shutter for a simple retro photo experience."
                },
                new Product
                {
                    Name = "sony walkman",
                    Price = 95,
                    ImageUrl = "./images/audio/walkman00.jpeg",
                    Images = new List<string> { "./images/audio/walkman00.jpeg" },
                    Category = "audio",
                    SubCategory = "cassette player",
                    Brand = "sony",
                    Condition = "used",
                    Description = "a classic sony walkman cassette player built for portable analog listening. perfect for vintage music lovers who want that real tape sound and tactile button feel. insert your cassette, connect wired headphones, and enjoy music with a warm nostalgic character that modern players do not really replicate."
                },
                new Product {
                    Name = "sony psp",
                    Price = 123,
                    ImageUrl = "./images/gadgets/console08.jpg",
                    Category = "gadgets",
                    SubCategory = "game console",
                    Brand = "sony",
                    Condition = "used",
                    Description = "a portable sony psp gaming console with iconic early 2000s energy. great for handheld gaming, collecting, and retro tech lovers. use it for classic psp titles, media playback, and that clean nostalgic interface that still feels fun and stylish today."
                },

                new Product {
                    Name = "iPod",
                    Price = 750,
                    ImageUrl = "./images/audio/ipod01.jpeg",
                    Category = "audio",
                    SubCategory = "mp3",
                    Brand = "apple",
                    Condition = "new",
                    Description = "a collectible ipod music player with that instantly recognizable apple design. ideal for building a personal offline music library and enjoying a minimal distraction-free listening setup. sync your music, scroll through playlists, and use it as both a daily player and a statement vintage tech piece."
                },

                new Product {
                    Name = "kindle e-reader",
                    Price = 235,
                    ImageUrl = "./images/gadgets/ereader03.jpeg",
                    Category = "gadgets",
                    SubCategory = "e-reader",
                    Brand = "kindle",
                    Condition = "used",
                    Description = "a lightweight kindle e-reader made for comfortable digital reading. great for novels, study notes, and carrying a full library without extra bulk. use it for long reading sessions, travel, and quiet offline focus with a simple screen that feels easier on the eyes than a phone."
                },

                new Product {
                    Name = "koss headphone",
                    Price = 36,
                    ImageUrl = "./images/accessories/koss00.jpg",
                    Category = "accessories",
                    SubCategory = "headphone",
                    Brand = "koss",
                    Condition = "new",
                    Description = "a pair of koss headphones with a retro portable audio look and lightweight design. perfect for walkmans, mp3 players, cd players, or any simple everyday listening setup. plug them in for casual music sessions, commute use, or to complete a full vintage audio aesthetic."
                },

                new Product {
                    Name = "canon digital ixus 50",
                    Price = 459,
                    ImageUrl = "./images/photo-video/canon00.jpg",
                    Category = "photo-video",
                    SubCategory = "digital camera",
                    Brand = "canon",
                    Condition = "used",
                    Description = "a compact canon digital camera known for its soft flash, early digital color tone, and easy pocket size. ideal for party photos, mirror selfies, and casual daily shots with that retro digicam feel. just charge it, point, shoot, and capture images with a look that feels instantly nostalgic."
                },

                new Product {
                    Name = "sony e-reader",
                    Price = 156,
                    ImageUrl = "./images/gadgets/ereader02.jpg",
                    Category = "gadgets",
                    SubCategory = "e-reader",
                    Brand = "sony",
                    Condition = "used",
                    Description = "a sony e-reader with a sleek minimal design and practical reading-focused experience. made for users who want a clean device for books, documents, and relaxed screen time. use it during travel, study sessions, or before sleep when you want a simpler alternative to a phone or laptop."
                },

                new Product {
                    Name = "blackberry phone",
                    Price = 50,
                    ImageUrl = "./images/gadgets/phone02.jpg",
                    Category = "gadgets",
                    SubCategory = "phone",
                    Brand = "blackberry",
                    Condition = "used",
                    Description = "a retro blackberry phone with the iconic keyboard design that made it stand out. perfect for collectors, old-school tech fans, or anyone who loves tactile typing and vintage mobile aesthetics. use it as a display piece, prop, or nostalgic gadget that still brings serious early smartphone energy."
                },

                new Product {
                    Name = "panasonic headphone",
                    Price = 45,
                    ImageUrl = "./images/accessories/panasonic00.jpg",
                    Category = "accessories",
                    SubCategory = "headphone",
                    Brand = "panasonic",
                    Condition = "used",
                    Description = "a panasonic headphone set with a simple retro build and wired connection for classic players. ideal for pairing with cassette players, discmans, and other portable audio gear. use them for laid-back listening, collecting, or building a complete vintage sound setup."
                },

                new Product {
                    Name = "polaroid camera",
                    Price = 157,
                    ImageUrl = "./images/photo-video/polaroid00.jpeg",
                    Category = "photo-video",
                    SubCategory = "analogue camera",
                    Brand = "polaroid",
                    Condition = "new",
                    Description = "an instant-style polaroid camera made for fun physical photos and spontaneous moments. great for parties, room decor, memory keeping, and gifting. load the proper film, take your shot, and enjoy the excitement of a real printed image developing in your hands."
                },

                new Product {
                    Name = "suzuki omnichord",
                    Price = 867,
                    ImageUrl = "./images/audio/suzuki02.jpeg",
                    Category = "audio",
                    SubCategory = "omnichord",
                    Brand = "suzuki",
                    Condition = "new",
                    Description = "a suzuki omnichord, one of the most unique and recognizable electronic instruments in vintage music culture. perfect for musicians, collectors, and anyone into dreamy experimental sound. use the chord buttons and strum plate to create layered melodies, unusual textures, and soft electronic vibes."
                },

                new Product {
                    Name = "kobo e-reader",
                    Price = 347,
                    ImageUrl = "./images/gadgets/ereader01.jpg",
                    Category = "gadgets",
                    SubCategory = "e-reader",
                    Brand = "kobo",
                    Condition = "used",
                    Description = "a kobo e-reader built for focused reading and everyday portability. ideal for carrying books, reading articles, and having a simple device just for content without social media distractions. use it for travel, quiet mornings, and long reading sessions wherever you want."
                },

                new Product {
                    Name = "vw lighter",
                    Price = 125,
                    ImageUrl = "./images/accessories/vwlighter00.jpg",
                    Category = "accessories",
                    SubCategory = "lighter",
                    Brand = "vivienne westwood",
                    Condition = "new",
                    Description = "a statement accessory lighter with a strong vintage fashion vibe and collectible appeal. perfect for styling, display, accessory shelves, and adding character to a retro-inspired setup. use it as a fashion piece, collector item, or small object that brings personality into your collection."
                },

                new Product {
                    Name = "Kodak Pixpro FZ-55",
                    Price = 359,
                    ImageUrl = "./images/photo-video/kodak00.jpg",
                    Category = "photo-video",
                    SubCategory = "digital camera",
                    Brand = "kodak",
                    Condition = "used",
                    Description = "a compact kodak digital camera made for casual photography with a simple interface and easy everyday use. great for travel, content creation, and capturing soft retro-style digital photos. keep it in your bag, turn it on quickly, and use it for spontaneous shots without overthinking settings."
                },

                new Product {
                    Name = "discman",
                    Price = 450,
                    ImageUrl = "./images/audio/discman01.jpg",
                    Category = "audio",
                    SubCategory = "discman",
                    Brand = "unknown",
                    Condition = "used",
                    Description = "a portable discman for cd listening with that unmistakable old-school audio feel. ideal for collectors and anyone who still loves physical media. insert your favorite cd, connect wired headphones, and enjoy a music setup that feels slower, more intentional, and way more nostalgic."
                },

                new Product {
                    Name = "p2102v phone",
                    Price = 25,
                    ImageUrl = "./images/gadgets/phone03.jpg",
                    Category = "gadgets",
                    SubCategory = "phone",
                    Brand = "p2102v",
                    Condition = "new",
                    Description = "a retro-style mobile phone with a compact body and old-school design language. best for collectors, prop styling, or building a vintage tech shelf with unique devices. use it as a display item or nostalgic throwback piece that reflects early mobile culture."
                },

                new Product {
                    Name = "hello kity tamagotchi nano",
                    Price = 39,
                    ImageUrl = "./images/accessories/brelok01.jpg",
                    Category = "accessories",
                    SubCategory = "brelock",
                    Brand = "Bandai",
                    Condition = "new",
                    Description = "a small tamagotchi nano keychain accessory with playful collectible charm and nostalgic character. great for bags, keys, shelf styling, or fans of cute retro handheld toys. use it as a decorative piece, collectible gadget, or fun little accessory that adds personality to your everyday items."
                },

                new Product {
                    Name = "Sony DCR-DVD650 DVD Handycam Camcorder",
                    Price = 234,
                    ImageUrl = "./images/photo-video/handycam00.jpg",
                    Category = "photo-video",
                    SubCategory = "handycam",
                    Brand = "sony",
                    Condition = "new",
                    Description = "a sony handycam camcorder made for recording home videos, creative clips, and that unmistakable early digital camcorder look. perfect for nostalgic video content, archives, and casual filming with character. use it for events, travel footage, or raw dreamy video that feels way more alive than phone footage."
                },

                new Product {
                    Name = "sony mp3 player",
                    Price = 29,
                    ImageUrl = "./images/audio/mp3digital02.jpg",
                    Category = "audio",
                    SubCategory = "mp3",
                    Brand = "sony",
                    Condition = "new",
                    Description = "a compact sony mp3 player made for simple portable listening without distractions. ideal for workouts, travel, and keeping a personal offline music collection. load your tracks, connect headphones, and enjoy a lightweight music device that feels practical and nostalgic at the same time."
                },

                new Product {
                    Name = "sony psp",
                    Price = 67,
                    ImageUrl = "./images/gadgets/console02.jpg",
                    Category = "gadgets",
                    SubCategory = "game console",
                    Brand = "sony",
                    Condition = "used",
                    Description = "a classic sony psp handheld console for gaming on the go with a timeless portable format. great for collectors, casual players, and anyone who misses the golden era of handheld consoles. use it for retro gaming, media playback, or simply as one of the coolest tech pieces from the 2000s."
                },

                new Product {
                    Name = "sony headphone",
                    Price = 368,
                    ImageUrl = "./images/accessories/sony5a00.jpg",
                    Category = "accessories",
                    SubCategory = "headphone",
                    Brand = "sony",
                    Condition = "new",
                    Description = "a sony headphone set with a bold vintage look and reliable wired listening setup. perfect for pairing with walkmans, mp3 players, discmans, and other retro gear. use it for music sessions, styling your desk setup, or building a full collection with matching era-correct accessories."
                }
            );
        }

        context.SaveChanges();
    }
}