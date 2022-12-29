using Server;

class Program
{
    const string URI = "http://192.168.86.25/";

    public static void Main(string[] args)
    {
        Listener listener = new Listener(URI);
        listener.StartServer();
    }
}