using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {

        }

        //ime Activities ce biti ime tabele u bazi
        public DbSet<Activity> Activities { get; set; }
    }
}