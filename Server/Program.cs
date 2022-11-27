using Server;

class Program
{
    const string URI = "http://spatialattributes.com/";

    public static void enableCors()
    {
        
    }

    public static void Main(string[] args)
    {
        Listener listener = new Listener(URI);
        listener.StartServer();
    }
}