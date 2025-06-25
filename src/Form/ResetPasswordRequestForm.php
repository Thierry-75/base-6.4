<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Validator\Constraints\Sequentially;

class ResetPasswordRequestForm extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
        ->add('email',EmailType::class,['attr'=>['class'=>'input-gray',
        'placeholder'=>'Adresse courriel','autofocus'=>false,'required'=>true],
        'constraints' => [
            new Sequentially([
                new NotBlank(message: ""),
                new Length(['max' => 180, 'maxMessage' => '']),
                new Email(message: 'L\'adresse courriel {{ value }} est incorrecte.',)
            ])
        ]
        ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([]);
    }
}
