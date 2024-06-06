// components/DeleteConfirmationDialog.jsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const DeleteConfirmationDialog = ({ open, onClose, onConfirm }) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>คุณแน่ใจแล้วใช่มั้ยที่จะลบ</AlertDialogTitle>
          <AlertDialogDescription>
            หลังจากการกดยืนยันแล้วจะไม่สามารถกู้คืนข้อมูลได้
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>ยืนยัน</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;
