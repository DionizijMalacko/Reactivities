using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    //u sustini ovo je valjda taj neki sablon Mediatora, da napravimo dve klase unutar klase
    public class Details
    {
        //ovu klasu definisemo sta vraca (Activity)
        public class Query : IRequest<Result<ActivityDTO>>
        {
            public Guid Id { get; set; }
        }

        //ova klasa je kao handler za proslu, kada je definisemo pomocu quickFix je implementiramo
        public class Handler : IRequestHandler<Query, Result<ActivityDTO>>
        {
            private readonly IMapper _mapper;

            //generisemo Constructor i prosledjujemo mu DataContext koja nam sluzi za bazu
            private readonly DataContext _context; //initialize field from parameter
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;

            }

            //dodajemo da je async
            public async Task<Result<ActivityDTO>> Handle(Query request, CancellationToken cancellationToken)
            {
                //request je klasa iznad sto smo kreirali (Query), ona ima polje Id pa zbog toga mozemo da pretrazimo pomocu ID-a
                var activity = await _context.Activities
                    .ProjectTo<ActivityDTO>(_mapper.ConfigurationProvider)
                    .FirstOrDefaultAsync(x => x.Id == request.Id);

                return Result<ActivityDTO>.Success(activity);
            }
        }
    }
}