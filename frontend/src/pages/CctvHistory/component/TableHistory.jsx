import {useTranslation} from "react-i18next";
import {useMemo, useState} from "react";
import {ColumnHeader, TableData} from "shared/components/table";
import {timestamp_to_string} from "shared/utils/utils";
import CardLayout from "shared/components/base/CardLayout";
import { CiImageOn } from "react-icons/ci";
import {ModalDialog} from "shared/components/dialog";
import DialogCctvDetails from "src/pages/Home/component/DialogCctvDetails";

const TableHistory = ({title, values}) => {
  const {t} = useTranslation();
  const [confirmationModal, setConfirmationModal] = useState(null);

  const colPrefix = "";
  const reformatHeader = (header) => {
    return header.replace(colPrefix, "").replace(/_/g, " "); // Replace underscores with spaces
  };
  const columns = useMemo(() => [
    {
      accessorKey: "#",
      size: 50,
      enableSorting: false,
      header: ({column}) => {
        return (<ColumnHeader column={column} title={"#"}/>)
      },
      cell: ({row}) => {
        return <div className="text-center">{row.index + 1}</div>
      },
    },
    {
      accessorKey: "dt",
      enableSorting: true,
      header: ({column}) => {
        return (<ColumnHeader column={column} title={"Date"}/>)
      },
      cell: ({cell}) => {
        return <div className="">{timestamp_to_string(cell.getValue(), 1000, "yyyy-MM-dd HH:mm")}</div>
      },
    },
    {
      accessorKey: "motorcycle",
      enableSorting: true,
      header: ({column}) => {
        return (<ColumnHeader column={column} title={"Motorcycle"}/>)
      },
    },
    {
      accessorKey: "car",
      enableSorting: true,
      header: ({column}) => {
        return (<ColumnHeader column={column} title={reformatHeader("Car")}/>)
      },
    },
    {
      accessorKey: "bus",
      enableSorting: true,
      header: ({column}) => {
        return (<ColumnHeader column={column} title={reformatHeader("Bus")}/>)
      },
    },
    {
      accessorKey: "truck",
      enableSorting: true,
      header: ({column}) => {
        return (<ColumnHeader column={column} title={"Truck"}/>)
      },
    },
    {
      accessorKey: "total",
      enableSorting: true,
      header: ({column}) => {
        return (<ColumnHeader column={column} title={reformatHeader("Total")}/>)
      },
    },
    {
      accessorKey: "thumbnail",
      enableSorting: false,
      header: ({column}) => {
        return (<ColumnHeader column={column} title={"Thumbnail"}/>)
      },
      cell: ({row}) => {
        let cctv = {...row.original, no: values?.cctv?.no};
        return (
          <div className={"btn btn-sm btn-square"} onClick={() =>
            setConfirmationModal({
              title: values?.cctv?.no + ". " + values?.cctv?.cctv_name + " - " + timestamp_to_string(cctv?.dt ?? 0),
              content: <DialogCctvDetails cctv={cctv} timestamp={cctv?.lastUpdated ?? ""}/>,
              confirmText: "Close",
              styles: "w-10/12 max-w-[800px]",
              onConfirmClick: () => setConfirmationModal(null),
              onCancelClick: () => setConfirmationModal(null),
            })
          }><CiImageOn className={"text-2xl"}/></div>
        )
      },
    }
  ], []);

  return (
    <CardLayout title={title}>
      <TableData columns={columns} data={values?.data ?? []} rowsPerPage={10} showTopToolbar={true} showBottomToolbar={true}/>

      {confirmationModal && <ModalDialog modal={confirmationModal} />}
    </CardLayout>
  )
}
export default TableHistory
