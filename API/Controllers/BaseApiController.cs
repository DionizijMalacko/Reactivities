using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    //pazi samo [controller] mora biti izmedju [] i njega menja sa imenom kontrollera, api mora biti napolju inace imamo error
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        
    }
}