using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            //Mapiramo Activity u Activity
            CreateMap<Activity, Activity>(); 
        }
    }
}