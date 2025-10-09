import mitt from 'mitt'

type Events = {
	refresh: string
}

const emitter = mitt<Events>()

export default emitter
