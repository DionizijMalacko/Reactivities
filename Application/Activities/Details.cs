using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    //u sustini ovo je valjda taj neki sablon Mediatora, da napravimo dve klase unutar klase
    public class Details
    {
        //ovu klasu definisemo sta vraca (Activity)
        public class Query : IRequest<Result<Activity>>
        {
            public Guid Id { get; set; }
        }

        //ova klasa je kao handler za proslu, kada je definisemo pomocu quickFix je implementiramo
        public class Handler : IRequestHandler<Query, Result<Activity>>
        {

            //generisemo Constructor i prosledjujemo mu DataContext koja nam sluzi za bazu
            private readonly DataContext _context; //initialize field from parameter
            public Handler(DataContext context)
            {
                _context = context;

            }

            //dodajemo da je async
            public async Task<Result<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                //request je klasa iznad sto smo kreirali (Query), ona ima polje Id pa zbog toga mozemo da pretrazimo pomocu ID-a
                var activity = await _context.Activities.FindAsync(request.Id);

                return Result<Activity>.Success(activity);
            }
        }
    }
}