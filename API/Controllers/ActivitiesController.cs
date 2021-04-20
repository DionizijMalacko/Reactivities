using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    //pocetna ruta je /api/activities zato sto BaseApiController nasledjuje ControllerBase koji to definise
    public class ActivitiesController : BaseApiController
    {

        [HttpGet]
        public async Task<ActionResult<List<Activity>>> GetActivities()
        {
            return await Mediator.Send(new List.Query());
        }

        [HttpGet("{id}")] //ruta ce biti activities/id
        public async Task<ActionResult<Activity>> GetActivity(Guid id)
        {
            //pomocu Send metode kreiramo novu Details klasu i prosledjujemo joj id koji dobijamo kao parametar 
            return await Mediator.Send(new Details.Query{Id = id});
        }

        //ovde koristimo IActionResult posto ovde ne vracamo nista, ali posto moramo nesto vratiti 
        //on nam omogucava da vratimo barem status kod
        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity) {
            //[FromBody]Activity activity pomaze API-ju da zna gde da nadje objekat Activity, mada bi ga trebao naci i bez toga
            return Ok(await Mediator.Send(new Create.Command{Activity = activity}));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, Activity activity) {
            activity.Id = id;
            return Ok(await Mediator.Send(new Edit.Command{Activity = activity}));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id) {
            
            return Ok(await Mediator.Send(new Delete.Command{Id = id}));
        }
    }
}