export interface Article {
    id:number,
    title:string,
    subtitle:string | null,
    category:string,
    abstract:string,
    body:string | null,
    update_date:number | null,
    image_media_type?: string | null,
    image_data?: string | null,
		thumbnail_image?: string | null,
		thumbnail_media_type?: string | null,
    username: string
}
