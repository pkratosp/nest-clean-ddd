// o value object é uma classe em que a gente identifica a individualidade dessa classe de acordo com o valor da suas propriedades
export abstract class ValueObject<Props> {
    protected props: Props

    constructor(props: Props) {
        this.props = props
    }

    public equals(vo: ValueObject<unknown>) {
        if(vo === null || vo === undefined) {
            return false
        }

        if(vo.props === undefined) {
            return false
        }

        // se não converter para um tipo primitivo sera comparado por endereço de memoria, ai sempre vai da falço
        return JSON.stringify(vo.props) === JSON.stringify(this.props)
    }
}