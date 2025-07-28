import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Axios from "axios";
import toast from "react-hot-toast";

type Props = {
  Comp_name: string;
  onSell: () => void;
};
export function AlertDialogDemo({ Comp_name, onSell }: Props) {
  const handleSell = async () => {
    try {
      await Axios.post("/api/sell-all", {
        Comp_name
      });
      toast.success("Stock sold successfully");
      onSell();
    } catch (error) {
      toast.error("Error selling stock");
      console.error("Error selling stock:", error);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Sell All</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will sell all the units of the
            company from your portfolio.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSell}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
