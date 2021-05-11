using System;

namespace Domain
{
    public class ActivityAttendee
    {
        public string AppUserId { get; set; }

        public AppUser AppUser { get; set; }
    
        public Guid ActivityId { get; set; }

        public Activity Activity { get; set; }

        //dodajemo jos properties koje zelimo
        public bool IsHost { get; set; }
    }
}