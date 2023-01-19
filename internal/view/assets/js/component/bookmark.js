const template = `
<div class="bookmark" :class="{list: ListMode, 'no-thumbnail': HideThumbnail, selected: selected}">
	<a class="bookmark-selector" 
		v-if="editMode" 
		@click="selectBookmark">
	</a>
	<a class="bookmark-link" :href="mainURL" target="_blank" rel="noopener">
		<span class="thumbnail" v-if="thumbnailVisible" :style="thumbnailStyleURL"></span>
		<p class="title" dir="auto">{{title}}
			<i v-if="hasContent" class="fa-solid fa-file-lines"></i>
			<i v-if="hasArchive" class="fa-solid fa-box-archive"></i>
			<i v-if="public" class="fa-solid fa-eye"></i>
		</p>
		<p class="excerpt" v-if="excerptVisible">{{excerpt}}</p>
		<p class="id" v-show="ShowId">{{id}}</p>
	</a>
	<div class="bookmark-tags" v-if="tags.length > 0">
		<a v-for="tag in tags" @click="tagClicked($event, tag.name)">{{tag.name}}</a>
	</div>
	<div class="spacer"></div>
	<div class="bookmark-menu">
		<a class="url" :href="url" target="_blank" rel="noopener">
			{{hostnameURL}}
		</a>
		<template v-if="!editMode && menuVisible">
			<a title="Edit bookmark" @click="editBookmark">
				<i class="fa-solid fa-fw fa-pencil"></i>
			</a>
			<a title="Delete bookmark" @click="deleteBookmark">
				<i class="fa-solid fa-fw fa-trash-can"></i>
			</a>
			<a title="Update archive" @click="updateBookmark">
				<i class="fa-solid fa-fw fa-cloud-arrow-down"></i>
			</a>
            <a v-if="hasEbook" title="Download book" @click="downloadebook">
                <i class="fa-solid fa-fw fa-book"></i>
            </a>
		</template>
	</div>
</div>`;

export default {
    template: template,
    props: {
        id: Number,
        url: String,
        title: String,
        excerpt: String,
        public: Number,
        imageURL: String,
        hasContent: Boolean,
        hasArchive: Boolean,
		hasEbook: Boolean,
        index: Number,
		ShowId: Boolean,
        editMode: Boolean,
		ListMode: Boolean,
		HideThumbnail: Boolean,
		HideExcerpt: Boolean,
        selected: Boolean,
        menuVisible: Boolean,
        tags: {
            type: Array,
            default() {
                return []
            }
        }
    },
    emits: ['edit', 'delete', 'update', 'select', 'tag-clicked'],
    computed: {
        mainURL() {
            if (this.hasContent) {
                return new URL(`bookmark/${this.id}/content`, document.baseURI);
            } else if (this.hasArchive) {
                return new URL(`bookmark/${this.id}/archive`, document.baseURI);
            } else {
                return this.url;
            }
        },
		ebookURL() {
			if (this.hasEbook) {
				return new URL(`bookmark/${this.id}/ebook`, document.baseURI);
			} else  {
                return null;
            }
		},
        hostnameURL() {
            const url = new URL(this.url);
            return url.hostname.replace(/^www\./, '');
        },
        thumbnailVisible() {
            return this.imageURL !== null && this.imageURL !== '' && !this.HideThumbnail;
        },
        excerptVisible() {
            return this.excerpt !== null && this.excerpt !== '' && !this.thumbnailVisible && !this.HideExcerpt;
        },
        thumbnailStyleURL() {
            return `background-image: url("${this.imageURL}")`;
        },
        eventItem() {
            return {
                id: this.id,
                index: this.index
            }
        }
    },
    methods: {
        editBookmark() {
            this.$emit('edit', this.eventItem);
        },
        deleteBookmark() {
            this.$emit('delete', this.eventItem);
        },
        updateBookmark() {
            this.$emit('update', this.eventItem);
        },
        selectBookmark() {
            this.$emit('select', this.eventItem);
        },
        tagClicked(name, event) {
            this.$emit('tag-clicked', name, event);
		},
		downloadebook() {
            const id = this.id;
            const ebook_url = new URL(`bookmark/${id}/ebook`, document.baseURI);
            const downloadLink = document.createElement("a");
            downloadLink.href = ebook_url.toString();
            downloadLink.download = `${this.title}.epub`;
            downloadLink.click();
		},
    }
}