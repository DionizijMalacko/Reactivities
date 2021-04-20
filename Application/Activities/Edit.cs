using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Activity Activity { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            
            //dodajemo automapper pored contexta
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Activity.Id);

                //request.Activity je Activiti koji smo dobili pomocu naseg requesta
                //activity smo dobili iz baze
                //u sustini mapiramo sva polja koja smo izmenili na frontu u ovaj activity koji imamo u bazi
                _mapper.Map(request.Activity, activity);

                await _context.SaveChangesAsync();

                return Unit.Value;
            }
        }
    }
}