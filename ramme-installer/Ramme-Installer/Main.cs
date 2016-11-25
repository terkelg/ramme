using IWshRuntimeLibrary;
using Ramme_Installer.Properties;
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.IO;
using System.IO.Compression;
using System.Net;
using System.Threading;
using System.Windows.Forms;

namespace Ramme_Installer
{
    public partial class Main : Form
    {
        private float Angle = 0f;

        public Main()
        {
            InitializeComponent();
            DoubleBuffered = true;
        }
        
        protected override void WndProc(ref Message m)
        {
            base.WndProc(ref m);
            if (m.Msg == 0x84)
                m.Result = (IntPtr)(0x2);
        }

        protected override void OnPaintBackground(PaintEventArgs e)
        {
            var gradient = new LinearGradientBrush(new Rectangle(0, 0, 600, 400), Color.Black, Color.Black, 0f);
            var cb = new ColorBlend();
            cb.Positions = new[] { 0f, 0.4f, 0.6f, 1f };
            cb.Colors = new[] { Color.FromArgb(49, 66, 236), Color.FromArgb(186, 16, 126), Color.FromArgb(239, 83, 49), Color.FromArgb(249, 216, 120) };

            gradient.InterpolationColors = cb;
            gradient.RotateTransform(Angle);
            gradient.WrapMode = WrapMode.TileFlipX;

            e.Graphics.FillRectangle(gradient, 0, 0, 600, 600);

            Angle += 0.1f;

            Invalidate();
        }


        protected override void OnPaint(PaintEventArgs e)
        {
            var bmp = new Bitmap(Resources.ramme_logo, 256, 256);

            e.Graphics.SmoothingMode = SmoothingMode.AntiAlias;
            e.Graphics.CompositingQuality = CompositingQuality.HighQuality;
            e.Graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
            
            e.Graphics.DrawImage(bmp, new Rectangle(172, 72, 256, 256));

        }

        private void OnLoad(object sender, EventArgs e)
        {
            var Downloader = new Thread(Download);
            Downloader.IsBackground = true;
            Downloader.Start();

        }

        private static void Download ()
        {
            var FileName = Guid.NewGuid().ToString().Replace("-", string.Empty).Substring(0, 8) + ".zip";

            var BaseURL = "https://github.com/terkelg/ramme/releases/download/";

            var URL = string.Format("{0}{1}/Ramme-{2}-{3}.zip", BaseURL, GetVersion(), GetPlatform(), GetVersion());
            
            var DownloadPath = Path.Combine(Path.GetTempPath(), FileName);

            var InstallationDirectory = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), ".Ramme");

            if (!Directory.Exists(InstallationDirectory))
                Directory.CreateDirectory(InstallationDirectory);

            //Console.WriteLine(DownloadPath);
            //Console.WriteLine(GetPlatform());

            using (var Client = new WebClient())
            {
                Client.DownloadFile(URL, DownloadPath);
            }

            ZipFile.ExtractToDirectory(DownloadPath, InstallationDirectory);

            if (GetPlatform() == "windows64")
            {
                var Desktop = (object)"Desktop";
                var Shell = new WshShell();
                var shortcutAddress = (string)Shell.SpecialFolders.Item(ref Desktop) + @"\Ramme.lnk";

                IWshShortcut shortcut = (IWshShortcut)Shell.CreateShortcut(shortcutAddress);
                shortcut.Description = "Unofficial Instagram Desktop App";
                shortcut.TargetPath = Path.Combine(InstallationDirectory, "Ramme.exe");
                shortcut.Save();
            }

            Application.Exit();
        }

        private static string GetPlatform()
        {
            if (Environment.OSVersion.VersionString.Substring(0, 9) == "Microsoft" && Environment.GetEnvironmentVariable("PROCESSOR_ARCHITEW6432") == "AMD64")
                return "windows64";
            else
                return "windows";
        }

        private static string GetVersion ()
        {
            using (WebClient Client = new WebClient())
            {
                return Client.DownloadString("https://raw.githubusercontent.com/VoOoLoX/ramme/master/releases").Trim();
            }
        }

    }
}
