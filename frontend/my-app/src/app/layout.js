import "./globals.css";

export const metadata = {
  title: "Collify - Your own classroom manager",
  description: "Modern learning platform with quizzes and classrooms",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
