namespace Application.Core
{
    public class AppException
    {
        //u production modu imacemo statusCode i message, details ce biti null
        //u development modu imacemo statusCode, message i details
        public AppException(int statusCode, string message, string details = null)
        {
            StatusCode = statusCode;
            Message = message;
            Details = details;
        }

        public int StatusCode { get; set; }
        public string Message { get; set; }
        public string Details { get; set; }
    }
}