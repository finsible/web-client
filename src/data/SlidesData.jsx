import graphImgLight from "../assets/light/graph_illustration_light.svg";
import loginImgLight from "../assets/light/login_illustration_light.svg";
import welcomeImgLight from "../assets/light/welcome_illustration_light.svg";
import transactionsImgLight from "../assets/light/transactions_illustration_light.svg";
// Import dark mode images
import graphImgDark from "../assets/dark/graph_illustration_dark.svg";
import loginImgDark from "../assets/dark/login_illustration_dark.svg";
import welcomeImgDark from "../assets/dark/welcome_illustration_dark.svg";
import transactionsImgDark from "../assets/dark/transactions_illustration_dark.svg";

const slides = [
  {
    imageLight: welcomeImgLight,
    imageDark: welcomeImgDark,
    title: "Welcome to Finsible",
    description:
      "Discover the smarter way to take control of your finances. Finsible empowers you to track, manage, and achieve your financial goals—all in one place.",
  },
  {
    imageLight: transactionsImgLight,
    imageDark: transactionsImgDark,
    title: "Where your money goes?",
    description:
      "Effortlessly track and categorize every expense. From daily coffee runs to big purchases, Finsible ensures you always know where your money is going.",
  },
  {
    imageLight: graphImgLight,
    imageDark: graphImgDark,
    title: "Your goals, achieved!",
    description:
      "Set personalized financial goals, track your progress over time, and achieve the financial freedom you've always wanted with actionable insights.",
  },
  {
    imageLight: loginImgLight,
    imageDark: loginImgDark,
    title: "Start your journey...",
    description:
      "Get started by signing in with Google. Experience a seamless, secure, and personalized way to manage your finances with Finsible.",
  },
];

export default slides;