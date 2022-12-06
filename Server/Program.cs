using Server;

class Program
{
    const string URI = "http://localhost:8080/";

    public static void Main(string[] args)
    {
        Listener listener = new Listener(URI);
        listener.StartServer();
    }
}