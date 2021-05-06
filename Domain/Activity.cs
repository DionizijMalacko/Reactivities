using System;

namespace Domain
{
    public class Activity
    {
        //Guid izgenerise id sa serverske ili klijentske strane
        public Guid Id { get; set; }

        //[Required]
        public string Title { get; set; }

        public DateTime Date { get; set; }

        public string Description { get; set; }

        public string Category { get; set; }

        public string City { get; set; }

        public string Venue { get; set; }
    }
}