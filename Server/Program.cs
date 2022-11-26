using System.Net;

class Program
{
    public static void Main(string[] args)
    {
        HttpListener listener = new HttpListener();
        string uri = "http://www.spatialattributes.com/";
        listener.Prefixes.Add(uri);
        listener.Start();

        Console.Write("Running...");
        while (true)
        {
            HttpListenerContext ctx = listener.GetContext();
            HttpListenerResponse response = ctx.Response;
            
            string responseString = "Hello world!";
            byte[] buffer = System.Text.Encoding.UTF8.GetBytes(responseString);
            response.ContentLength64 = buffer.Length;

            System.IO.Stream output = response.OutputStream;
            output.Write(buffer, 0, buffer.Length);
        }
    }
}