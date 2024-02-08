import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, Loader2Icon } from 'lucide-react'

import { Button } from '../ui/button'
import { DataViewChangePageTrigger, DataViewPagingStateView, DataViewSetItemsPerPageTrigger } from '@contember/react-dataview'
import { DropdownMenu } from '@radix-ui/react-dropdown-menu'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown'

export const DataTablePagination = () => (
	<div className="flex gap-6 lg:gap-8 justify-between">
		<div className="">
			<DataViewPagingStateView render={it => <>
				<div className={'text-sm font-medium'}>Page {it.pageIndex + 1}{it.pagesCount !== undefined ? <> of {it.pagesCount}</> : null}</div>
				<div className={'font-normal text-xs'}>{it.totalCount ?? <Loader2Icon className="animate-spin h-3 w-3 inline-block" />} rows total</div>
			</>} />
		</div>
		<div className="flex items-center space-x-2">
			<DataViewChangePageTrigger page="first">
				<Button
					variant="outline"
					className="hidden h-8 w-8 p-0 lg:flex"
				>
					<span className="sr-only">Go to first page</span>
					<ChevronsLeftIcon className="h-4 w-4" />
				</Button>
			</DataViewChangePageTrigger>
			<DataViewChangePageTrigger page="previous">
				<Button
					variant="outline"
					className="h-8 w-8 p-0"
				>
					<span className="sr-only">Go to previous page</span>
					<ChevronLeftIcon className="h-4 w-4" />
				</Button>
			</DataViewChangePageTrigger>
			<DataViewChangePageTrigger page="next">
				<Button
					variant="outline"
					className="h-8 w-8 p-0"
				>
					<span className="sr-only">Go to next page</span>
					<ChevronRightIcon className="h-4 w-4" />
				</Button>
			</DataViewChangePageTrigger>
			<DataViewChangePageTrigger page="last">
				<Button
					variant="outline"
					className="hidden h-8 w-8 p-0 lg:flex"
				>
					<span className="sr-only">Go to last page</span>
					<ChevronsRightIcon className="h-4 w-4" />
				</Button>
			</DataViewChangePageTrigger>
		</div>
		<div className="flex items-center space-x-2">
			<p className="text-sm font-medium">Rows per page</p>
			<DropdownMenu
			>
				<DropdownMenuTrigger asChild>
					<Button
						variant="outline"
						className="h-8 w-[70px] p-0 justify-between px-4"
					>
						<DataViewPagingStateView render={it => it.itemsPerPage} />

						<ChevronDownIcon className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					{[5, 10, 20, 30, 40, 50].map(pageSize => (
						<DataViewSetItemsPerPageTrigger value={pageSize} key={pageSize}>
							<DropdownMenuItem key={pageSize} className={'data-[active]:font-bold'}>
								{pageSize}
							</DropdownMenuItem>
						</DataViewSetItemsPerPageTrigger>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	</div>
)
