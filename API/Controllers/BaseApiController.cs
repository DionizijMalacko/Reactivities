using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace API.Controllers
{
    //pazi samo [controller] mora biti izmedju [] i njega menja sa imenom kontrollera, api mora biti napolju inace imamo error
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        private IMediator _mediator;

        //??= -> ako je _mediator null uzmi onu drugu vrednost tj HttpContext.RequestServices.GetService<IMediator>(), ako nije null onda uzme _mediator
        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();

        protected ActionResult HandleResult<T>(Result<T> result) {
            
            if(result == null) {
                return NotFound();
            }

            if(result.IsSuccess && result.Value != null) {
                return Ok(result.Value);
            }

            if(result.IsSuccess && result.Value == null) {
                return NotFound();
            }

            return BadRequest(result.Error);
        }
    }
}