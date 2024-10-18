import Table from "@/components/common/table/table"
import { SortColumn, TableColumn } from "@/components/common/table/types"
import { SubscriptionAndUser } from "@/lib/types/subscription-manager"
import { calculateDiff, getStatusColor } from "@/lib/utils"
import {
	EnvelopeIcon,
	PencilSquareIcon,
	TrashIcon,
} from "@heroicons/react/20/solid"
import moment from "moment"
import { Tooltip, TooltipProvider } from "./common/tooltip"
import DeleteSubscriptionModal from "./subscription-manager-modals/deleteSubscription"
import EditSubscriptionModal from "./subscription-manager-modals/editSubscription"
import NotifyUserByEmailModal from "./subscription-manager-modals/notifyByEmail"
import useModal from "./subscription-manager-modals/useSubscriptionModal"

export type SubscriptionManagerProps = {
	subscriptionToRender: SubscriptionAndUser[]
	sortColumn: SortColumn<SubscriptionAndUser>
	onSort: (sm: SortColumn<SubscriptionAndUser>) => void
}

export default function SubscriptionManagerTable({
	subscriptionToRender,
	sortColumn,
	onSort,
}: SubscriptionManagerProps) {
	const {
		visible: isDeleteModalVisible,
		toggle: deleteModalToggle,
		subscription: deleteSubscription,
		setSubscription: setDeleteSubscription,
	} = useModal()

	const {
		visible: isEditModalVisible,
		toggle: editModalToggle,
		subscription: editSubscription,
		setSubscription: setEditSubscription,
	} = useModal()

	const {
		visible: isMailModalVisible,
		toggle: mailModalToggle,
		subscription: mailSubscription,
		setSubscription: setMailSubscription,
	} = useModal()

	async function onEdit(subscription: SubscriptionAndUser) {
		setEditSubscription(subscription)
		editModalToggle()
	}

	async function onMail(subscription: SubscriptionAndUser) {
		setMailSubscription(subscription)
		mailModalToggle()
	}

	// delete
	async function onDelete(subscription: SubscriptionAndUser) {
		setDeleteSubscription(subscription)
		deleteModalToggle()
	}

	//TODO improve generation of diff var
	const columns: TableColumn<SubscriptionAndUser>[] = [
		{
			hidden: false,
			key: "status",
			label: "Status",
			content: ({ expirationDate }) => {
				const diff = calculateDiff(expirationDate)
				const statusColor = getStatusColor(diff)

				return (
					<div className="sm:pl-4">
						<span
							className={`inline-block h-2 w-2 flex-shrink-0 rounded-full ${statusColor}`}
							aria-hidden={true}
						/>
					</div>
				)
			},
			__type: "custom",
		},
		{
			hidden: true,
			label: "Username",
			path: "userUsername",
			__type: "standard",
		},
		{
			hidden: true,
			label: "Server",
			path: "type",
			__type: "standard",
		},
		{
			hidden: true,
			label: "Notificato",
			key: "userNotificated",
			content: ({ userNotificated }: SubscriptionAndUser) => (
				<>{userNotificated ? "Si" : "No"}</>
			),
			__type: "custom",
		},
		{
			hidden: true,
			label: "Note",
			path: "notes",
			__type: "standard",
			additionalClasses: "ESKERE",
		},

		{
			hidden: true,
			label: "Scadenza",
			key: "expirationDate",
			content: ({ expirationDate }: SubscriptionAndUser) => (
				<>{moment(expirationDate).format("DD/MM/YYYY")}</>
			),
			__type: "custom",
		},
		{
			hidden: true,
			label: "GG rimanenti",
			key: "availableDays",
			content: ({ expirationDate }: SubscriptionAndUser) => (
				<div>{calculateDiff(expirationDate)}</div>
			),
			__type: "custom",
		},
		{
			hidden: false,
			key: "edit",
			content: (subscription: SubscriptionAndUser) => (
				<a
					className="text-teal-600 cursor-pointer hover:text-teal-900"
					onClick={() => onEdit(subscription)}
				>
					<Tooltip label="Modifica utente">
						<PencilSquareIcon width={20} height={20} />
					</Tooltip>
				</a>
			),
			__type: "custom",
		},
		{
			hidden: false,
			key: "mail",
			content: (subscription: SubscriptionAndUser) => (
				<a
					className="text-blue-600 cursor-pointer hover:text-blue-900"
					onClick={() => onMail(subscription)}
				>
					<Tooltip label="Invia email">
						<EnvelopeIcon width={20} height={20} />
					</Tooltip>
				</a>
			),
			__type: "custom",
		},
		{
			hidden: false,
			key: "delete",
			content: (subscription: SubscriptionAndUser) => (
				<div className="pr-4">
					<a
						className="text-red-600 cursor-pointer hover:text-red-900"
						onClick={() => onDelete(subscription)}
					>
						<Tooltip label="Elimina utente">
							<TrashIcon height={20} width={20} />
						</Tooltip>
					</a>
				</div>
			),
			__type: "custom",
		},
	]

	return (
		<>
			<div className="px-4 sm:px-6 lg:px-8">
				<div className="mt-8 -mx-4 sm:-mx-0">
					<TooltipProvider>
						<Table
							columns={columns}
							onSort={onSort}
							sortColumn={sortColumn}
							data={subscriptionToRender}
						/>
					</TooltipProvider>
				</div>
			</div>

			{/* Delete subscription modal */}
			<DeleteSubscriptionModal
				visible={isDeleteModalVisible}
				toggle={deleteModalToggle}
				subscription={deleteSubscription}
			/>

			{/* Edit subscription modal */}
			{editSubscription && (
				<EditSubscriptionModal
					visible={isEditModalVisible}
					toggle={editModalToggle}
					subscription={editSubscription}
				/>
			)}

			{/* Mail  modal */}
			{mailSubscription && (
				<NotifyUserByEmailModal
					visible={isMailModalVisible}
					toggle={mailModalToggle}
					subscription={mailSubscription}
				/>
			)}
		</>
	)
}
