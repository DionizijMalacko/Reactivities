using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class UpdateAttendance
    {
        
        //Command zato sto nista ne vraca (Result<Unit>)
        public class Command : IRequest<Result<Unit>>
        {
            //params koje primamo 
            public Guid Id { get; set; }
        }


        //Ovde ide logika
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            
            //UserAccessor da bi znali koji je user trenutno
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            //Update activity, imamo 3 slucaja, kada je Host, kada je gost i kada ne postoji activity
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                //dobavimo activity iz baze sa datim Id koji prosledjujemo
                var activity = await _context.Activities
                    .Include(a => a.Attendees).ThenInclude(u => u.AppUser)
                    .FirstOrDefaultAsync(x => x.Id == request.Id);

                if(activity == null) return null;

                //dobavljamo trenutnog ulogovanog user-a
                var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());

                if(user == null) return null;


                //gledamo ko je Host ako ga ima uopste
                var hostUsername = activity.Attendees.FirstOrDefault(x => x.IsHost)?.AppUser?.UserName;

                //provera da li je nas user uopste ige na tu activity
                var attendance = activity.Attendees.FirstOrDefault(x => x.AppUser.UserName == user.UserName);

                //ako je host onda moze da cancel-uje ili da ponovo otvori activity
                if(attendance != null && hostUsername == user.UserName) {
                    activity.IsCancelled = !activity.IsCancelled;
                }

                //ako je gost samo sklonimo aktivnost iz planiranih aktivnosti
                if(attendance != null && hostUsername != user.UserName) {
                    activity.Attendees.Remove(attendance);
                }
                
                //ako je nema onda je kreiramo
                if(attendance == null) {
                    attendance = new ActivityAttendee {
                        AppUser = user,
                        Activity = activity,
                        IsHost = false
                    };

                    activity.Attendees.Add(attendance);
                }
                
                //cuvamo u bazu 
                var result = await _context.SaveChangesAsync() > 0;

                //vracamo rezultat sta god da je
                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem updating attendance");
            }
        }
    }
}