import {
	AnchorButton,
	Component,
	CreateScope,
	DataGrid,
	DeleteEntityButton,
	EditScope,
	EnumCell,
	Field,
	FieldView,
	GenericCell,
	HasMany,
	HasManySelectCell,
	HasOneSelectCell,
	If,
	ImageUploadField,
	LinkButton,
	MultiSelectField,
	NavigateBackLink,
	NumberCell,
	PersistButton,
	RichTextField,
	SelectField,
	SlugField,
	TextCell,
	TextField,
} from '@contember/admin'
import { DataGridTile } from '../components/DataGridTile'
import { Directive, Title } from '../components/Directives'
import { Slots } from '../components/Slots'
import { CategoryForm } from './categories'


const stateOptions = {
	draft: 'Draft',
	published: 'Published',
	removed: 'Removed',
}

export const List = () => (
	<>
		<Title>Articles</Title>
		<Directive name="cms-layout.content.maxWidth" content={null} />
		<Slots.Actions><LinkButton to="article/create">Add article</LinkButton></Slots.Actions>
		<Slots.Content>
			<DataGrid
				entities="Article"
				itemsPerPage={20}
				tile={<DataGridTile
					to={`article/edit(id: $entity.id)`}
					thumbnailField="image.url"
					titleField="title"
				/>}
				tileSize={100}
			>
				<TextCell field="title" header="Title" />
				<TextCell field="content" header="Content" />
				<HasOneSelectCell field="category" options={`Category.locales(locale.code = 'cs').name`} header="Category" />
				<HasManySelectCell field="tags" options={`Tag.locales(locale.code = 'cs').name`} header="Tags" />
				<EnumCell field={'state'} options={stateOptions} header={'State'} />
				<NumberCell field="number" header="Number" />
				<GenericCell canBeHidden={false} justification="justifyEnd">
					<LinkButton to={`article/edit(id: $entity.id)`} Component={AnchorButton}>Edit</LinkButton>
					<DeleteEntityButton title="Delete" immediatePersist={true} />
				</GenericCell>
			</DataGrid>
		</Slots.Content>
	</>
)

const ArticleForm = Component(() => <>
	<TextField field={'title'} label={'Title'} />

	<SlugField field={'slug'} label={'Slug'} derivedFrom={'title'} unpersistedHardPrefix={'http://localhost/'} persistedHardPrefix={'bar/'}
		persistedSoftPrefix={'lorem/'} linkToExternalUrl />
	<RichTextField field={'content'} label={'Content'} />

	<ImageUploadField
		label="Image"
		baseEntity="image"
		urlField="url"
		widthField="width"
		heightField="height"
		fileSizeField="size"
		fileTypeField="type"
	/>

	<If condition={'[state = removed]'}>
		<TextField field={'title'} label={'Title'} />
	</If>
</>,
	'ArticleForm',
)
const CategoryOptionItem = Component(() => {
	return <>
		<Field field={'name'} />, locales:
		<HasMany field={'locales'}>
			<Field field={'name'} />
		</HasMany>
	</>
})
const ArticleSidebarForm = Component(() => <>
	<SelectField field={'state'} label={'State'} options={Object.entries(stateOptions).map(([value, label]) => ({ value, label }))} allowNull />
	{/*<MultiSelectField*/}
	{/*	label={'tags'}*/}
	{/*	field={'tags'}*/}
	{/*	options={{*/}
	{/*		fields: 'Tag.name',*/}
	{/*		orderBy: 'name desc',*/}
	{/*	}}*/}
	{/*	createNewForm={<TextField field={'name'} label={'Name'} />}*/}
	{/*/>*/}
	<MultiSelectField
		label={'tags'}
		field={'tags'}
		options={`Tag.locales(locale.code = 'cs').name`}
		lazy
	/>
	<MultiSelectField
		label={'Sortable tags'}
		field={'sortedTags'}
		options={{
			fields: 'Tag.name',
			orderBy: 'name desc',
		}}
		createNewForm={<TextField field={'name'} label={'Name'} />}

		connectingEntityField={'tag'}
		sortableBy={'order'}
		lazy
	/>

	<SelectField
		label={'category'}
		field={'category'}
		createNewForm={<CategoryForm />}
		searchByFields={'name'}
		options={{
			entities: 'Category',
			orderBy: 'name desc',
		}}
		optionLabel={<CategoryOptionItem />}
		lazy
	/>
</>,
	'ArticleSidebarForm',
)

export const EditOrCreateForm = Component(() => (
	<>
		<Slots.Actions><PersistButton /></Slots.Actions>

		<Slots.ContentStack>
			<ArticleForm />
		</Slots.ContentStack>

		<Slots.SidebarStack>
			<ArticleSidebarForm />
		</Slots.SidebarStack>
	</>
), 'EditOrCreateForm')

export const create = (
	<>
		<Slots.Back>
			<NavigateBackLink to="article/list">Back to articles</NavigateBackLink>
		</Slots.Back>
		<Title>New Article</Title>
		<CreateScope entity="Article" redirectOnSuccess="article/edit(id: $entity.id)">
			<EditOrCreateForm />
		</CreateScope>
	</>
)

export const edit = (
	<EditScope entity="Article(id = $id)">
		<FieldView field="title" render={title => (
			<Title>{`Edit ${title.getAccessor().value ? title.getAccessor().value : 'Article'}`}</Title>
		)} />

		<EditOrCreateForm />
	</EditScope>
)
