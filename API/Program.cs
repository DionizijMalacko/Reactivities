using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
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

            //scope ce host-ovati bilo koje servise koji ce biti pozvaci valjda u ovoj metodi, i kad se pokrene aplikacija valjda ce sve dispouse-ovati
            using var scopre = host.Services.CreateScope();

            var services = scopre.ServiceProvider;
            
            //ako nemamo bazu niti neke podatke u njoj, ovaj try ce se izvrsiti, kreirace tabele i popuniti bazu
            try{
                //DataContext smo u Startup.cs dodali u servise, zato sad mozemo da ga pozovemo
                var context = services.GetRequiredService<DataContext>();
                await context.Database.MigrateAsync(); //stavljamo na async
                await Seed.SeedData(context); //zbog ovoga main metoda mora biti async
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
