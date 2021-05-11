using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    //IdentityUser sadrzi sva ostala polja kao Id itd, a mi ovde dodajemo samo dodatna polja
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public string Bio { get; set; }

        public ICollection<ActivityAttendee> Activities {get; set;}
    }
}