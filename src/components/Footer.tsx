import Link from "next/link";
import Logo from "./Logo";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="w-full pt-10 md:pt-40 text-gray-300 border-t border-gray-300/20">
      <div className="container-section flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500 pb-14">
        <div className="md:max-w-96">
          <Link href="/">
            <Logo />
          </Link>

          <p className="mt-6 text-sm">
            Lorem Ipsum has been the industry&apos;s standard dummy text ever
            since the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Image
              src="/googlePlay-DT9q0T4u.svg"
              alt="google play"
              className="h-9 w-auto"
              width={200}
              height={100}
            />
            <Image
              src="/appStore-6IautTmU.svg"
              alt="app store"
              className="h-9 w-auto"
              width={200}
              height={100}
            />
          </div>
        </div>
        <div className="flex-1 flex items-start md:justify-around gap-20 md:gap-40">
          <div>
            <h2 className="font-semibold mb-5">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">About us</a>
              </li>
              <li>
                <a href="#">Contact us</a>
              </li>
              <li>
                <a href="#">Privacy policy</a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>+1-234-567-890</p>
              <p>contact@example.com</p>
            </div>
          </div>
        </div>
      </div>
      <p className="pt-4 text-center text-sm pb-5">
        Copyright {new Date().getFullYear()} ©{" "}
        <a href="https://prebuiltui.com">ELASYDEV</a>. All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
