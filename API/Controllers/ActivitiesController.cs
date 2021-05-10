using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    //pocetna ruta je /api/activities zato sto BaseApiController nasledjuje ControllerBase koji to definise
    [AllowAnonymous]
    public class ActivitiesController : BaseApiController
    {

        [HttpGet]
        public async Task<IActionResult> GetActivities()
        {
            return HandleResult(await Mediator.Send(new List.Query()));
        }

        [HttpGet("{id}")] //ruta ce biti activities/id
        public async Task<IActionResult> GetActivity(Guid id)
        {
            //pomocu Send metode kreiramo novu Details klasu i prosledjujemo joj id koji dobijamo kao parametar 
            var result = await Mediator.Send(new Details.Query{Id = id});

            return HandleResult(result);
        }

        //IActionResult nam omogucava da vracamo HTTP responses
        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity) {
            return HandleResult(await Mediator.Send(new Create.Command{Activity = activity}));
        }



        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, Activity activity) {
            activity.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command{Activity = activity}));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id) {
            
            return HandleResult(await Mediator.Send(new Delete.Command{Id = id}));
        }
    }
}