using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Persistence;

namespace API
{
    public class Program
    {
        public static async Task Main(string[] args) //menjamo void na Task
        {
            //brisemo .Run() sa kraja, samo ga Build-ujemo
            var host = CreateHostBuilder(args).Build();

            using var scopre = host.Services.CreateScope();

            var services = scopre.ServiceProvider;
            
            //ako nemamo bazu niti neke podatke u njoj, ovaj try ce se izvrsiti, kreirace tabele i popuniti bazu
            try{
                var context = services.GetRequiredService<DataContext>();
                var userManager = services.GetRequiredService<UserManager<AppUser>>();
                await context.Database.MigrateAsync(); 
                await Seed.SeedData(context, userManager); 
            } catch(Exception ex) {
                var logger = services.GetRequiredService<ILogger<Program>>();
                logger.LogError(ex, "An error occured during miigration");
            }

            //ovde ga pokrecemo, mora da se doda da bi se aplikacija pokrenula!
            await host.RunAsync(); //stavljamo na async
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
