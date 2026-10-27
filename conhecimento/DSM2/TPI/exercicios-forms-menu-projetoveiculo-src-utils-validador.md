---
disciplina: DSM2/TPI
titulo: Validador
fonte: DSM2/TPI/exercicios/Forms/Menu/ProjetoVeiculo/src/Utils/Validador.java
tipo: java
paginas: 0
extraido_em: 2026-10-24
---

```java
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package Utils;

import javax.swing.text.PlainDocument;
import javax.swing.text.AttributeSet;
import javax.swing.text.BadLocationException;

/**
 *
 * @author haimo
 */
public class Validador extends PlainDocument{
    
    private int limite;

    public Validador(int limite) {
        super();
        this.limite = limite;
    }
    
    @Override
    public void insertString(int ofs, String str, AttributeSet a) 
            throws BadLocationException{
        if(getLength() + str.length() <= limite){
            super.insertString(ofs, str, a);
        }
        
    }
    
}
```
