class Tooltip extends HTMLElement {
  
  // private _tooltipContainer: HTMLDivElement
  private _tooltipText: string
  private _tooltipIcon: HTMLSpanElement
  private _tooltipVisible: boolean = false
  
  constructor() {
    super()
    
    // this._tooltipContainer = document.createElement('div')
    this._tooltipIcon = document.createElement('span')
    this.attachShadow({ mode: "open" })
    this._tooltipText = ""
    // const template = document.querySelector('#tooltip-template') as HTMLTemplateElement
    // this.shadowRoot?.appendChild(template.content.cloneNode(true))
    this.shadowRoot!.innerHTML = `
      <style>
        div {
          font-weight: normal;
          background-color: black;
          color: white;
          position: absolute;
          top: 1rem;
          left: .75rem;
          z-index: 10;
          padding: .15rem;
          border-radius: 3px;
          box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.26);
        }

        :host {
          position: relative;
        }

        :host(.important) {
          background: var(--color-primary, #ccc);
        }

        :host-context(p) {
          font-weight: bold;
        }

        .highlight {
          background-color: red;
        }

        ::slotted(.highlight) {
          border-bottom: 1px dotted red;
        }

        .icon {
          background: black;
          color: white;
          padding: 0.25rem 0.5rem;
          text-align: center;
          border-radius: 50%;
        }
      </style>
      <slot>Some default</slot>
      <span class="icon">?<span>
    `
  }

  async connectedCallback() {
    this._tooltipText = this.getAttribute('text') || ""

    this._tooltipIcon = this.shadowRoot?.querySelector('span') as HTMLSpanElement
    this._tooltipIcon.addEventListener('mouseenter', this._showTooltip.bind(this))
    this._tooltipIcon.addEventListener('mouseleave', this._hideTooltip.bind(this))
    // this.style.position = 'relative'
    this._render()
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {  
    
    if (oldValue === newValue) {
      return
    }

    if (name === 'text') {
      this._tooltipText = newValue
    }
  }

  disconnectedCallback() {
    this._tooltipIcon.removeEventListener('mouseenter', this._showTooltip)
    this._tooltipIcon.removeEventListener('mouseleave', this._hideTooltip)
  }

  static get observedAttributes() {
    return ['text']
  }

  private _render() {
    let tooltipContainer = this.shadowRoot?.querySelector('div');
    if (this._tooltipVisible) {
      tooltipContainer = document.createElement('div')
      tooltipContainer.textContent = this._tooltipText
      this.shadowRoot?.appendChild(tooltipContainer)
    } else if (tooltipContainer) {
      this.shadowRoot?.removeChild(tooltipContainer)
    }
  }

  private _showTooltip() {
    this._tooltipVisible = true
    this._render()
  }

  private _hideTooltip() {
    this._tooltipVisible = false
    this._render()
  }

}
 
customElements.define('uc-tooltip', Tooltip)