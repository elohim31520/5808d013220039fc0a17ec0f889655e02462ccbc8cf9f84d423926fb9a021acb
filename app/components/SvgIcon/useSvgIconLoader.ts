import { onMounted, type ComputedRef, watchEffect } from 'vue'

const loadedSymbols: string[] = []

type SvgIconProps = {
	prefix: string
	name: string
	size: string
}

export function useSvgIconLoader(props: SvgIconProps, symbolId: ComputedRef<string>) {
	const loadSvg = async () => {
		if (loadedSymbols.includes(symbolId.value)) return
		loadedSymbols.push(symbolId.value)

		let svgContent = ''
		try {
			// 動態導入 SVG 文件
			const svgModule = await import(`../../icons/svg/${props.name}.svg?raw`)
			svgContent = svgModule.default
		} catch (error) {
			console.error(`加載 SVG 文件出錯：${props.name}`)
			return
		}

		if (import.meta.client) {
			// 解析 SVG 內容
			const parser = new DOMParser()
			const doc = parser.parseFromString(svgContent, 'image/svg+xml')
			const svgElement = doc.documentElement

			// 創建 symbol
			const symbolDom = document.createElementNS('http://www.w3.org/2000/svg', 'symbol')
			symbolDom.setAttribute('id', symbolId.value)
			symbolDom.setAttribute('fill', 'none')
			if (svgElement.getAttribute('viewBox')) {
				symbolDom.setAttribute('viewBox', svgElement.getAttribute('viewBox')!)
			}
			while (svgElement.firstChild) {
				symbolDom.appendChild(svgElement.firstChild)
			}

			// 創建 svg 容器
			let svgContainerDom: Element | null = document.getElementById('__svg__icons__dom__')
			if (!svgContainerDom) {
				const newSvgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
				newSvgContainer.setAttribute('id', '__svg__icons__dom__')
				newSvgContainer.setAttribute('style', 'position:absolute; width:0; height:0')
				newSvgContainer.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
				newSvgContainer.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
				document.body.insertBefore(newSvgContainer, document.body.firstChild)
				svgContainerDom = newSvgContainer
			}
			svgContainerDom.appendChild(symbolDom)
		}
	}

	watchEffect(() => {
		loadSvg()
	})
}
