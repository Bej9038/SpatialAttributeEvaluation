using System;
using System.Net.Sockets;

namespace ConsoleApplication1
{
    public class Program
    {
        private Socket serverSocket;
        private int serverPort = 80;

        public void Listen()
        {
            
        }

        public void startServer()
        {
            try
            {
                serverSocket = new Socket(SocketType.Stream, ProtocolType.Tcp);
            }
            catch (Exception e)
            {
                Console.WriteLine("Unable to start the server");
            }
            
        }

        public void stopServer()
        {
        }


        public static void Main(string[] args)
        {
        }
    }
}