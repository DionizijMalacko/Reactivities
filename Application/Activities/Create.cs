using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        //Command ne prima nikakav parametar posto moze biti bilo sta
        public class Command : IRequest
        {
            //prosledjujemo joj objekat Activity
            public Activity Activity { get; set; }
        }

        //takodje, prima samo Command bez drugog parametra
        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            //Task<Unit> ne vraca nista ali govori da je ova akcija zavrsena
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                //nije AddAsync posto se ta metoda koristi samo za cuvanje u bazu, a mi ovde ne cuvamo jos
                _context.Activities.Add(request.Activity);
                
                //ovde sada cuvamo u bazu pa zato ide await
                await _context.SaveChangesAsync();

                //zbog task<unit> moramo da vratimo nesto, odnosno vracamo nista
                return Unit.Value;
            }
        }
    }
}