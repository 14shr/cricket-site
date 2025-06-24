import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-primary text-primary-foreground py-6">
            <div className="container mx-auto text-center text-sm">
                <p>&copy; {new Date().getFullYear()} CricStats Central | Follow us on 
                    <Link href="#" className="underline underline-offset-2 ml-1">Twitter</Link>, 
                    <Link href="#" className="underline underline-offset-2 ml-1">Instagram</Link>, 
                    &amp; 
                    <Link href="#" className="underline underline-offset-2 ml-1">YouTube</Link>
                </p>
            </div>
        </footer>
    )
}
