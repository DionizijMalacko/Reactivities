using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        //Command ne prima nikakav parametar posto moze biti bilo sta
        //Unit da specificiramo da zapravo ne vracamo nista
        public class Command : IRequest<Result<Unit>>
        {
            //prosledjujemo joj objekat Activity
            public Activity Activity { get; set; }
        }

        //Navodimo sta cemo validirati, u ovom slucaju Command posto on sadrzi Activity
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
            }
        }

        //takodje, prima samo Command bez drugog parametra
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }


            //Task<Unit> ne vraca nista ali govori da je ova akcija zavrsena
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                //nije AddAsync posto se ta metoda koristi samo za cuvanje u bazu, a mi ovde ne cuvamo jos
                _context.Activities.Add(request.Activity);
                
                //ovde sada cuvamo u bazu pa zato ide await
                var result = await _context.SaveChangesAsync() > 0; //saveChanges vvraca integer

                if(!result) {
                    return Result<Unit>.Failure("Failed to create activity");
                }

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}