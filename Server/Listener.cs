using System.Net;

namespace Server;

public class Listener
{
    private HttpListener listener = new HttpListener();
    public Listener(string uri)
    {
        listener.Prefixes.Add(uri);
    }

    public void StartServer()
    {
        listener.Start();
        Console.Write("Running...");
        while (true)
        {
            HttpListenerContext ctx = listener.GetContext();
            HttpListenerResponse response = ctx.Response;
            response.Headers.Add("Access-Control-Allow-Origin", "*");
            
            string responseString = "Hello world!";
            byte[] buffer = System.Text.Encoding.UTF8.GetBytes(responseString);
            response.ContentLength64 = buffer.Length;

            System.IO.Stream output = response.OutputStream;
            output.Write(buffer, 0, buffer.Length);
        }
    }
}