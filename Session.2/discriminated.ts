interface Alert {
  type: "alert";
}

interface Confirm {
  type: "confirm";
  confirmButtonMassage: string;
}

type Props = Alert | Confirm;

function Modal(props: Props) {
  if (props.type === "confirm") {
    const message = props.confirmButtonMassage.toUpperCase();
  }

  return null;
}
