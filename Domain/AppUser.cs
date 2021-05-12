using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    //IdentityUser sadrzi sva ostala polja kao Id itd, a mi ovde dodajemo samo dodatna polja
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public string Bio { get; set; }

        //ovo je za manyToMany relationship
        public ICollection<ActivityAttendee> Activities {get; set;}

        //ovo je za oneToMany
        public ICollection<Photo> Photos {get; set;}
    }
}