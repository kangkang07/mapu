export class ToolboxItem{
    name: string = ''
    title: string = ''
    icon?: string = ''
}

export class ToolboxGroup{
    title: string = ''
    icon?: string = ''
    name: string = ''
    collapse: boolean = false
    items:ToolboxItem[] = []
}
export const StudioToolboxData: ToolboxGroup[] = [
    {
        title: '几何图形',
        icon: '',
        name: 'shape',
        collapse: false,
        items: [
            {
                name: "point",
                title: '点',
                icon:''
            },
            {
                name: "line",
                title: '线',
                icon:''
            },
            {
                name: "circle",
                title: '圆',
                icon:''
            },
            {
                name: "polygon",
                title: '多边形',
                icon:''
            },
            {
                name: "rect",
                title: '矩形',
                icon:''
            },
           
        ]
    },
    {
        title: 'h3图形',
        icon: '',
        name: 'h3',
        collapse: false,
        items: [
            {
                name: "test",
                title: 'test',
                icon:''
            }
        ]
    },
   
]