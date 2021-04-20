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
    }
}