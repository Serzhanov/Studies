/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Message } from '../i18n/i18n_ast';
import { ParseSourceSpan } from '../parse_util';
import { I18nMeta } from '../render3/view/i18n/meta';
export declare enum TypeModifier {
    None = 0,
    Const = 1
}
export declare abstract class Type {
    modifiers: TypeModifier;
    constructor(modifiers?: TypeModifier);
    abstract visitType(visitor: TypeVisitor, context: any): any;
    hasModifier(modifier: TypeModifier): boolean;
}
export declare enum BuiltinTypeName {
    Dynamic = 0,
    Bool = 1,
    String = 2,
    Int = 3,
    Number = 4,
    Function = 5,
    Inferred = 6,
    None = 7
}
export declare class BuiltinType extends Type {
    name: BuiltinTypeName;
    constructor(name: BuiltinTypeName, modifiers?: TypeModifier);
    visitType(visitor: TypeVisitor, context: any): any;
}
export declare class ExpressionType extends Type {
    value: Expression;
    typeParams: Type[] | null;
    constructor(value: Expression, modifiers?: TypeModifier, typeParams?: Type[] | null);
    visitType(visitor: TypeVisitor, context: any): any;
}
export declare class ArrayType extends Type {
    of: Type;
    constructor(of: Type, modifiers?: TypeModifier);
    visitType(visitor: TypeVisitor, context: any): any;
}
export declare class MapType extends Type {
    valueType: Type | null;
    constructor(valueType: Type | null | undefined, modifiers?: TypeModifier);
    visitType(visitor: TypeVisitor, context: any): any;
}
export declare const DYNAMIC_TYPE: BuiltinType;
export declare const INFERRED_TYPE: BuiltinType;
export declare const BOOL_TYPE: BuiltinType;
export declare const INT_TYPE: BuiltinType;
export declare const NUMBER_TYPE: BuiltinType;
export declare const STRING_TYPE: BuiltinType;
export declare const FUNCTION_TYPE: BuiltinType;
export declare const NONE_TYPE: BuiltinType;
export interface TypeVisitor {
    visitBuiltinType(type: BuiltinType, context: any): any;
    visitExpressionType(type: ExpressionType, context: any): any;
    visitArrayType(type: ArrayType, context: any): any;
    visitMapType(type: MapType, context: any): any;
}
export declare enum UnaryOperator {
    Minus = 0,
    Plus = 1
}
export declare enum BinaryOperator {
    Equals = 0,
    NotEquals = 1,
    Identical = 2,
    NotIdentical = 3,
    Minus = 4,
    Plus = 5,
    Divide = 6,
    Multiply = 7,
    Modulo = 8,
    And = 9,
    Or = 10,
    BitwiseAnd = 11,
    Lower = 12,
    LowerEquals = 13,
    Bigger = 14,
    BiggerEquals = 15,
    NullishCoalesce = 16
}
export declare function nullSafeIsEquivalent<T extends {
    isEquivalent(other: T): boolean;
}>(base: T | null, other: T | null): boolean;
export declare function areAllEquivalent<T extends {
    isEquivalent(other: T): boolean;
}>(base: T[], other: T[]): boolean;
export declare abstract class Expression {
    type: Type | null;
    sourceSpan: ParseSourceSpan | null;
    constructor(type: Type | null | undefined, sourceSpan?: ParseSourceSpan | null);
    abstract visitExpression(visitor: ExpressionVisitor, context: any): any;
    /**
     * Calculates whether this expression produces the same value as the given expression.
     * Note: We don't check Types nor ParseSourceSpans nor function arguments.
     */
    abstract isEquivalent(e: Expression): boolean;
    /**
     * Return true if the expression is constant.
     */
    abstract isConstant(): boolean;
    prop(name: string, sourceSpan?: ParseSourceSpan | null): ReadPropExpr;
    key(index: Expression, type?: Type | null, sourceSpan?: ParseSourceSpan | null): ReadKeyExpr;
    callFn(params: Expression[], sourceSpan?: ParseSourceSpan | null, pure?: boolean): InvokeFunctionExpr;
    instantiate(params: Expression[], type?: Type | null, sourceSpan?: ParseSourceSpan | null): InstantiateExpr;
    conditional(trueCase: Expression, falseCase?: Expression | null, sourceSpan?: ParseSourceSpan | null): ConditionalExpr;
    equals(rhs: Expression, sourceSpan?: ParseSourceSpan | null): BinaryOperatorExpr;
    notEquals(rhs: Expression, sourceSpan?: ParseSourceSpan | null): BinaryOperatorExpr;
    identical(rhs: Expression, sourceSpan?: ParseSourceSpan | null): BinaryOperatorExpr;
    notIdentical(rhs: Expression, sourceSpan?: ParseSourceSpan | null): BinaryOperatorExpr;
    minus(rhs: Expression, sourceSpan?: ParseSourceSpan | null): BinaryOperatorExpr;
    plus(rhs: Expression, sourceSpan?: ParseSourceSpan | null): BinaryOperatorExpr;
    divide(rhs: Expression, sourceSpan?: ParseSourceSpan | null): BinaryOperatorExpr;
    multiply(rhs: Expression, sourceSpan?: ParseSourceSpan | null): BinaryOperatorExpr;
    modulo(rhs: Expression, sourceSpan?: ParseSourceSpan | null): BinaryOperatorExpr;
    and(rhs: Expression, sourceSpan?: ParseSourceSpan | null): BinaryOperatorExpr;
    bitwiseAnd(rhs: Expression, sourceSpan?: ParseSourceSpan | null, parens?: boolean): BinaryOperatorExpr;
    or(rhs: Expression, sourceSpan?: ParseSourceSpan | null): BinaryOperatorExpr;
    lower(rhs: Expression, sourceSpan?: ParseSourceSpan | null): BinaryOperatorExpr;
    lowerEquals(rhs: Expression, sourceSpan?: ParseSourceSpan | null): BinaryOperatorExpr;
    bigger(rhs: Expression, sourceSpan?: ParseSourceSpan | null): BinaryOperatorExpr;
    biggerEquals(rhs: Expression, sourceSpan?: ParseSourceSpan | null): BinaryOperatorExpr;
    isBlank(sourceSpan?: ParseSourceSpan | null): Expression;
    nullishCoalesce(rhs: Expression, sourceSpan?: ParseSourceSpan | null): BinaryOperatorExpr;
    toStmt(): Statement;
}
export declare class ReadVarExpr extends Expression {
    name: string;
    constructor(name: string, type?: Type | null, sourceSpan?: ParseSourceSpan | null);
    isEquivalent(e: Expression): boolean;
    isConstant(): boolean;
    visitExpression(visitor: ExpressionVisitor, context: any): any;
    set(value: Expression): WriteVarExpr;
}
export declare class TypeofExpr extends Expression {
    expr: Expression;
    constructor(expr: Expression, type?: Type | null, sourceSpan?: ParseSourceSpan | null);
    visitExpression(visitor: ExpressionVisitor, context: any): any;
    isEquivalent(e: Expression): boolean;
    isConstant(): boolean;
}
export declare class WrappedNodeExpr<T> extends Expression {
    node: T;
    constructor(node: T, type?: Type | null, sourceSpan?: ParseSourceSpan | null);
    isEquivalent(e: Expression): boolean;
    isConstant(): boolean;
    visitExpression(visitor: ExpressionVisitor, context: any): any;
}
export declare class WriteVarExpr extends Expression {
    name: string;
    value: Expression;
    constructor(name: string, value: Expression, type?: Type | null, sourceSpan?: ParseSourceSpan | null);
    isEquivalent(e: Expression): boolean;
    isConstant(): boolean;
    visitExpression(visitor: ExpressionVisitor, context: any): any;
    toDeclStmt(type?: Type | null, modifiers?: StmtModifier): DeclareVarStmt;
    toConstDecl(): DeclareVarStmt;
}
export declare class WriteKeyExpr extends Expression {
    receiver: Expression;
    index: Expression;
    value: Expression;
    constructor(receiver: Expression, index: Expression, value: Expression, type?: Type | null, sourceSpan?: ParseSourceSpan | null);
    isEquivalent(e: Expression): boolean;
    isConstant(): boolean;
    visitExpression(visitor: ExpressionVisitor, context: any): any;
}
export declare class WritePropExpr extends Expression {
    receiver: Expression;
    name: string;
    value: Expression;
    constructor(receiver: Expression, name: string, value: Expression, type?: Type | null, sourceSpan?: ParseSourceSpan | null);
    isEquivalent(e: Expression): boolean;
    isConstant(): boolean;
    visitExpression(visitor: ExpressionVisitor, context: any): any;
}
export declare class InvokeFunctionExpr extends Expression {
    fn: Expression;
    args: Expression[];
    pure: boolean;
    constructor(fn: Expression, args: Expression[], type?: Type | null, sourceSpan?: ParseSourceSpan | null, pure?: boolean);
    isEquivalent(e: Expression): boolean;
    isConstant(): boolean;
    visitExpression(visitor: ExpressionVisitor, context: any): any;
}
export declare class TaggedTemplateExpr extends Expression {
    tag: Expression;
    template: TemplateLiteral;
    constructor(tag: Expression, template: TemplateLiteral, type?: Type | null, sourceSpan?: ParseSourceSpan | null);
    isEquivalent(e: Expression): boolean;
    isConstant(): boolean;
    visitExpression(visitor: ExpressionVisitor, context: any): any;
}
export declare class InstantiateExpr extends Expression {
    classExpr: Expression;
    args: Expression[];
    constructor(classExpr: Expression, args: Expression[], type?: Type | null, sourceSpan?: ParseSourceSpan | null);
    isEquivalent(e: Expression): boolean;
    isConstant(): boolean;
    visitExpression(visitor: ExpressionVisitor, context: any): any;
}
export declare class LiteralExpr extends Expression {
    value: number | string | boolean | null | undefined;
    constructor(value: number | string | boolean | null | undefined, type?: Type | null, sourceSpan?: ParseSourceSpan | null);
    isEquivalent(e: Expression): boolean;
    isConstant(): boolean;
    visitExpression(visitor: ExpressionVisitor, context: any): any;
}
export declare class TemplateLiteral {
    elements: TemplateLiteralElement[];
    expressions: Expression[];
    constructor(elements: TemplateLiteralElement[], expressions: Expression[]);
}
export declare class TemplateLiteralElement {
    text: string;
    sourceSpan?: ParseSourceSpan | undefined;
    rawText: string;
    constructor(text: string, sourceSpan?: ParseSourceSpan | undefined, rawText?: string);
}
export declare class LiteralPiece {
    text: string;
    sourceSpan: ParseSourceSpan;
    constructor(text: string, sourceSpan: ParseSourceSpan);
}
export declare class PlaceholderPiece {
    text: string;
    sourceSpan: ParseSourceSpan;
    associatedMessage?: Message | undefined;
    /**
     * Create a new instance of a `PlaceholderPiece`.
     *
     * @param text the name of this placeholder (e.g. `PH_1`).
     * @param sourceSpan the location of this placeholder in its localized message the source code.
     * @param associatedMessage reference to another message that this placeholder is associated with.
     * The `associatedMessage` is mainly used to provide a relationship to an ICU message that has
     * been extracted out from the message containing the placeholder.
     */
    constructor(text: string, sourceSpan: ParseSourceSpan, associatedMessage?: Message | undefined);
}
export declare type MessagePiece = LiteralPiece | PlaceholderPiece;
export declare class LocalizedString extends Expression {
    readonly metaBlock: I18nMeta;
    readonly messageParts: LiteralPiece[];
    readonly placeHolderNames: PlaceholderPiece[];
    readonly expressions: Expression[];
    constructor(metaBlock: I18nMeta, messageParts: LiteralPiece[], placeHolderNames: PlaceholderPiece[], expressions: Expression[], sourceSpan?: ParseSourceSpan | null);
    isEquivalent(e: Expression): boolean;
    isConstant(): boolean;
    visitExpression(visitor: ExpressionVisitor, context: any): any;
    /**
     * Serialize the given `meta` and `messagePart` into "cooked" and "raw" strings that can be used
     * in a `$localize` tagged string. The format of the metadata is the same as that parsed by
     * `parseI18nMeta()`.
     *
     * @param meta The metadata to serialize
     * @param messagePart The first part of the tagged string
     */
    serializeI18nHead(): CookedRawString;
    getMessagePartSourceSpan(i: number): ParseSourceSpan | null;
    getPlaceholderSourceSpan(i: number): ParseSourceSpan;
    /**
     * Serialize the given `placeholderName` and `messagePart` into "cooked" and "raw" strings that
     * can be used in a `$localize` tagged string.
     *
     * The format is `:<placeholder-name>[@@<associated-id>]:`.
     *
     * The `associated-id` is the message id of the (usually an ICU) message to which this placeholder
     * refers.
     *
     * @param partIndex The index of the message part to serialize.
     */
    serializeI18nTemplatePart(partIndex: number): CookedRawString;
}
/**
 * A structure to hold the cooked and raw strings of a template literal element, along with its
 * source-span range.
 */
export interface CookedRawString {
    cooked: string;
    raw: string;
    range: ParseSourceSpan | null;
}
export declare class ExternalExpr extends Expression {
    value: ExternalReference;
    typeParams: Type[] | null;
    constructor(value: ExternalReference, type?: Type | null, typeParams?: Type[] | null, sourceSpan?: ParseSourceSpan | null);
    isEquivalent(e: Expression): boolean;
    isConstant(): boolean;
    visitExpression(visitor: ExpressionVisitor, context: any): any;
}
export declare class ExternalReference {
    moduleName: string | null;
    name: string | null;
    runtime?: any;
    constructor(moduleName: string | null, name: string | null, runtime?: any);
}
export declare class ConditionalExpr extends Expression {
    condition: Expression;
    falseCase: Expression | null;
    trueCase: Expression;
    constructor(condition: Expression, trueCase: Expression, falseCase?: Expression | null, type?: Type | null, sourceSpan?: ParseSourceSpan | null);
    isEquivalent(e: Expression): boolean;
    isConstant(): boolean;
    visitExpression(visitor: ExpressionVisitor, context: any): any;
}
export declare class NotExpr extends Expression {
    condition: Expression;
    constructor(condition: Expression, sourceSpan?: ParseSourceSpan | null);
    isEquivalent(e: Expression): boolean;
    isConstant(): boolean;
    visitExpression(visitor: ExpressionVisitor, context: any): any;
}
export declare class FnParam {
    name: string;
    type: Type | null;
    constructor(name: string, type?: Type | null);
    isEquivalent(param: FnParam): boolean;
}
export declare class FunctionExpr extends Expression {
    params: FnParam[];
    statements: Statement[];
    name?: string | null | undefined;
    constructor(params: FnParam[], statements: Statement[], type?: Type | null, sourceSpan?: ParseSourceSpan | null, name?: string | null | undefined);
    isEquivalent(e: Expression): boolean;
    isConstant(): boolean;
    visitExpression(visitor: ExpressionVisitor, context: any): any;
    toDeclStmt(name: string, modifiers?: StmtModifier): DeclareFunctionStmt;
}
export declare class UnaryOperatorExpr extends Expression {
    operator: UnaryOperator;
    expr: Expression;
    parens: boolean;
    constructor(operator: UnaryOperator, expr: Expression, type?: Type | null, sourceSpan?: ParseSourceSpan | null, parens?: boolean);
    isEquivalent(e: Expression): boolean;
    isConstant(): boolean;
    visitExpression(visitor: ExpressionVisitor, context: any): any;
}
export declare class BinaryOperatorExpr extends Expression {
    operator: BinaryOperator;
    rhs: Expression;
    parens: boolean;
    lhs: Expression;
    constructor(operator: BinaryOperator, lhs: Expression, rhs: Expression, type?: Type | null, sourceSpan?: ParseSourceSpan | null, parens?: boolean);
    isEquivalent(e: Expression): boolean;
    isConstant(): boolean;
    visitExpression(visitor: ExpressionVisitor, context: any): any;
}
export declare class ReadPropExpr extends Expression {
    receiver: Expression;
    name: string;
    constructor(receiver: Expression, name: string, type?: Type | null, sourceSpan?: ParseSourceSpan | null);
    isEquivalent(e: Expression): boolean;
    isConstant(): boolean;
    visitExpression(visitor: ExpressionVisitor, context: any): any;
    set(value: Expression): WritePropExpr;
}
export declare class ReadKeyExpr extends Expression {
    receiver: Expression;
    index: Expression;
    constructor(receiver: Expression, index: Expression, type?: Type | null, sourceSpan?: ParseSourceSpan | null);
    isEquivalent(e: Expression): boolean;
    isConstant(): boolean;
    visitExpression(visitor: ExpressionVisitor, context: any): any;
    set(value: Expression): WriteKeyExpr;
}
export declare class LiteralArrayExpr extends Expression {
    entries: Expression[];
    constructor(entries: Expression[], type?: Type | null, sourceSpan?: ParseSourceSpan | null);
    isConstant(): boolean;
    isEquivalent(e: Expression): boolean;
    visitExpression(visitor: ExpressionVisitor, context: any): any;
}
export declare class LiteralMapEntry {
    key: string;
    value: Expression;
    quoted: boolean;
    constructor(key: string, value: Expression, quoted: boolean);
    isEquivalent(e: LiteralMapEntry): boolean;
}
export declare class LiteralMapExpr extends Expression {
    entries: LiteralMapEntry[];
    valueType: Type | null;
    constructor(entries: LiteralMapEntry[], type?: MapType | null, sourceSpan?: ParseSourceSpan | null);
    isEquivalent(e: Expression): boolean;
    isConstant(): boolean;
    visitExpression(visitor: ExpressionVisitor, context: any): any;
}
export declare class CommaExpr extends Expression {
    parts: Expression[];
    constructor(parts: Expression[], sourceSpan?: ParseSourceSpan | null);
    isEquivalent(e: Expression): boolean;
    isConstant(): boolean;
    visitExpression(visitor: ExpressionVisitor, context: any): any;
}
export interface ExpressionVisitor {
    visitReadVarExpr(ast: ReadVarExpr, context: any): any;
    visitWriteVarExpr(expr: WriteVarExpr, context: any): any;
    visitWriteKeyExpr(expr: WriteKeyExpr, context: any): any;
    visitWritePropExpr(expr: WritePropExpr, context: any): any;
    visitInvokeFunctionExpr(ast: InvokeFunctionExpr, context: any): any;
    visitTaggedTemplateExpr(ast: TaggedTemplateExpr, context: any): any;
    visitInstantiateExpr(ast: InstantiateExpr, context: any): any;
    visitLiteralExpr(ast: LiteralExpr, context: any): any;
    visitLocalizedString(ast: LocalizedString, context: any): any;
    visitExternalExpr(ast: ExternalExpr, context: any): any;
    visitConditionalExpr(ast: ConditionalExpr, context: any): any;
    visitNotExpr(ast: NotExpr, context: any): any;
    visitFunctionExpr(ast: FunctionExpr, context: any): any;
    visitUnaryOperatorExpr(ast: UnaryOperatorExpr, context: any): any;
    visitBinaryOperatorExpr(ast: BinaryOperatorExpr, context: any): any;
    visitReadPropExpr(ast: ReadPropExpr, context: any): any;
    visitReadKeyExpr(ast: ReadKeyExpr, context: any): any;
    visitLiteralArrayExpr(ast: LiteralArrayExpr, context: any): any;
    visitLiteralMapExpr(ast: LiteralMapExpr, context: any): any;
    visitCommaExpr(ast: CommaExpr, context: any): any;
    visitWrappedNodeExpr(ast: WrappedNodeExpr<any>, context: any): any;
    visitTypeofExpr(ast: TypeofExpr, context: any): any;
}
export declare const NULL_EXPR: LiteralExpr;
export declare const TYPED_NULL_EXPR: LiteralExpr;
export declare enum StmtModifier {
    None = 0,
    Final = 1,
    Private = 2,
    Exported = 4,
    Static = 8
}
export declare class LeadingComment {
    text: string;
    multiline: boolean;
    trailingNewline: boolean;
    constructor(text: string, multiline: boolean, trailingNewline: boolean);
    toString(): string;
}
export declare class JSDocComment extends LeadingComment {
    tags: JSDocTag[];
    constructor(tags: JSDocTag[]);
    toString(): string;
}
export declare abstract class Statement {
    modifiers: StmtModifier;
    sourceSpan: ParseSourceSpan | null;
    leadingComments?: LeadingComment[] | undefined;
    constructor(modifiers?: StmtModifier, sourceSpan?: ParseSourceSpan | null, leadingComments?: LeadingComment[] | undefined);
    /**
     * Calculates whether this statement produces the same value as the given statement.
     * Note: We don't check Types nor ParseSourceSpans nor function arguments.
     */
    abstract isEquivalent(stmt: Statement): boolean;
    abstract visitStatement(visitor: StatementVisitor, context: any): any;
    hasModifier(modifier: StmtModifier): boolean;
    addLeadingComment(leadingComment: LeadingComment): void;
}
export declare class DeclareVarStmt extends Statement {
    name: string;
    value?: Expression | undefined;
    type: Type | null;
    constructor(name: string, value?: Expression | undefined, type?: Type | null, modifiers?: StmtModifier, sourceSpan?: ParseSourceSpan | null, leadingComments?: LeadingComment[]);
    isEquivalent(stmt: Statement): boolean;
    visitStatement(visitor: StatementVisitor, context: any): any;
}
export declare class DeclareFunctionStmt extends Statement {
    name: string;
    params: FnParam[];
    statements: Statement[];
    type: Type | null;
    constructor(name: string, params: FnParam[], statements: Statement[], type?: Type | null, modifiers?: StmtModifier, sourceSpan?: ParseSourceSpan | null, leadingComments?: LeadingComment[]);
    isEquivalent(stmt: Statement): boolean;
    visitStatement(visitor: StatementVisitor, context: any): any;
}
export declare class ExpressionStatement extends Statement {
    expr: Expression;
    constructor(expr: Expression, sourceSpan?: ParseSourceSpan | null, leadingComments?: LeadingComment[]);
    isEquivalent(stmt: Statement): boolean;
    visitStatement(visitor: StatementVisitor, context: any): any;
}
export declare class ReturnStatement extends Statement {
    value: Expression;
    constructor(value: Expression, sourceSpan?: ParseSourceSpan | null, leadingComments?: LeadingComment[]);
    isEquivalent(stmt: Statement): boolean;
    visitStatement(visitor: StatementVisitor, context: any): any;
}
export declare class IfStmt extends Statement {
    condition: Expression;
    trueCase: Statement[];
    falseCase: Statement[];
    constructor(condition: Expression, trueCase: Statement[], falseCase?: Statement[], sourceSpan?: ParseSourceSpan | null, leadingComments?: LeadingComment[]);
    isEquivalent(stmt: Statement): boolean;
    visitStatement(visitor: StatementVisitor, context: any): any;
}
export interface StatementVisitor {
    visitDeclareVarStmt(stmt: DeclareVarStmt, context: any): any;
    visitDeclareFunctionStmt(stmt: DeclareFunctionStmt, context: any): any;
    visitExpressionStmt(stmt: ExpressionStatement, context: any): any;
    visitReturnStmt(stmt: ReturnStatement, context: any): any;
    visitIfStmt(stmt: IfStmt, context: any): any;
}
export declare class RecursiveAstVisitor implements StatementVisitor, ExpressionVisitor {
    visitType(ast: Type, context: any): any;
    visitExpression(ast: Expression, context: any): any;
    visitBuiltinType(type: BuiltinType, context: any): any;
    visitExpressionType(type: ExpressionType, context: any): any;
    visitArrayType(type: ArrayType, context: any): any;
    visitMapType(type: MapType, context: any): any;
    visitWrappedNodeExpr(ast: WrappedNodeExpr<any>, context: any): any;
    visitTypeofExpr(ast: TypeofExpr, context: any): any;
    visitReadVarExpr(ast: ReadVarExpr, context: any): any;
    visitWriteVarExpr(ast: WriteVarExpr, context: any): any;
    visitWriteKeyExpr(ast: WriteKeyExpr, context: any): any;
    visitWritePropExpr(ast: WritePropExpr, context: any): any;
    visitInvokeFunctionExpr(ast: InvokeFunctionExpr, context: any): any;
    visitTaggedTemplateExpr(ast: TaggedTemplateExpr, context: any): any;
    visitInstantiateExpr(ast: InstantiateExpr, context: any): any;
    visitLiteralExpr(ast: LiteralExpr, context: any): any;
    visitLocalizedString(ast: LocalizedString, context: any): any;
    visitExternalExpr(ast: ExternalExpr, context: any): any;
    visitConditionalExpr(ast: ConditionalExpr, context: any): any;
    visitNotExpr(ast: NotExpr, context: any): any;
    visitFunctionExpr(ast: FunctionExpr, context: any): any;
    visitUnaryOperatorExpr(ast: UnaryOperatorExpr, context: any): any;
    visitBinaryOperatorExpr(ast: BinaryOperatorExpr, context: any): any;
    visitReadPropExpr(ast: ReadPropExpr, context: any): any;
    visitReadKeyExpr(ast: ReadKeyExpr, context: any): any;
    visitLiteralArrayExpr(ast: LiteralArrayExpr, context: any): any;
    visitLiteralMapExpr(ast: LiteralMapExpr, context: any): any;
    visitCommaExpr(ast: CommaExpr, context: any): any;
    visitAllExpressions(exprs: Expression[], context: any): void;
    visitDeclareVarStmt(stmt: DeclareVarStmt, context: any): any;
    visitDeclareFunctionStmt(stmt: DeclareFunctionStmt, context: any): any;
    visitExpressionStmt(stmt: ExpressionStatement, context: any): any;
    visitReturnStmt(stmt: ReturnStatement, context: any): any;
    visitIfStmt(stmt: IfStmt, context: any): any;
    visitAllStatements(stmts: Statement[], context: any): void;
}
export declare function leadingComment(text: string, multiline?: boolean, trailingNewline?: boolean): LeadingComment;
export declare function jsDocComment(tags?: JSDocTag[]): JSDocComment;
export declare function variable(name: string, type?: Type | null, sourceSpan?: ParseSourceSpan | null): ReadVarExpr;
export declare function importExpr(id: ExternalReference, typeParams?: Type[] | null, sourceSpan?: ParseSourceSpan | null): ExternalExpr;
export declare function importType(id: ExternalReference, typeParams?: Type[] | null, typeModifiers?: TypeModifier): ExpressionType | null;
export declare function expressionType(expr: Expression, typeModifiers?: TypeModifier, typeParams?: Type[] | null): ExpressionType;
export declare function typeofExpr(expr: Expression): TypeofExpr;
export declare function literalArr(values: Expression[], type?: Type | null, sourceSpan?: ParseSourceSpan | null): LiteralArrayExpr;
export declare function literalMap(values: {
    key: string;
    quoted: boolean;
    value: Expression;
}[], type?: MapType | null): LiteralMapExpr;
export declare function unary(operator: UnaryOperator, expr: Expression, type?: Type, sourceSpan?: ParseSourceSpan | null): UnaryOperatorExpr;
export declare function not(expr: Expression, sourceSpan?: ParseSourceSpan | null): NotExpr;
export declare function fn(params: FnParam[], body: Statement[], type?: Type | null, sourceSpan?: ParseSourceSpan | null, name?: string | null): FunctionExpr;
export declare function ifStmt(condition: Expression, thenClause: Statement[], elseClause?: Statement[], sourceSpan?: ParseSourceSpan, leadingComments?: LeadingComment[]): IfStmt;
export declare function taggedTemplate(tag: Expression, template: TemplateLiteral, type?: Type | null, sourceSpan?: ParseSourceSpan | null): TaggedTemplateExpr;
export declare function literal(value: any, type?: Type | null, sourceSpan?: ParseSourceSpan | null): LiteralExpr;
export declare function localizedString(metaBlock: I18nMeta, messageParts: LiteralPiece[], placeholderNames: PlaceholderPiece[], expressions: Expression[], sourceSpan?: ParseSourceSpan | null): LocalizedString;
export declare function isNull(exp: Expression): boolean;
export declare const enum JSDocTagName {
    Desc = "desc",
    Id = "id",
    Meaning = "meaning"
}
export declare type JSDocTag = {
    tagName: JSDocTagName | string;
    text?: string;
} | {
    tagName?: undefined;
    text: string;
};
